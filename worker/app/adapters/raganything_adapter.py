"""RAG-Anything adapter — replaces LanceDB vector index + LangChain RAG chain.

This adapter wraps RAG-Anything (built on LightRAG) to provide:
- Multimodal document ingestion (PDF, DOCX, images, tables, etc.)
- Knowledge-graph + vector hybrid retrieval
- Direct content list insertion
- Query with text-only or VLM-enhanced modes

Storage: RAG-Anything manages its own storage internally via LightRAG
(nano-vector DB, knowledge graph JSON, key-value stores).  LanceDB is
no longer required.
"""

from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from raganything import RAGAnything, RAGAnythingConfig

from app.adapters.ollama_lightrag import (
    get_embedding_func,
    get_llm_model_func,
    get_vision_model_func,
)
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# Singleton holder
# ---------------------------------------------------------------------------

_rag_instance: RAGAnythingAdapter | None = None


@dataclass
class RAGAnythingAdapter:
    """High-level adapter around RAGAnything for the file-manager worker."""

    rag: RAGAnything = field(repr=False)
    _initialized: bool = field(default=False, repr=False)

    # ------------------------------------------------------------------
    # Initialization
    # ------------------------------------------------------------------

    @classmethod
    def create(cls) -> "RAGAnythingAdapter":
        """Factory that builds a RAGAnythingAdapter from app settings."""
        settings = get_settings()

        config = RAGAnythingConfig(
            working_dir=settings.RAG_WORKING_DIR,
            parser=settings.RAG_PARSER,
            parse_method=settings.RAG_PARSE_METHOD,
            parser_output_dir=settings.RAG_OUTPUT_DIR,
            enable_image_processing=settings.RAG_ENABLE_IMAGE_PROCESSING,
            enable_table_processing=settings.RAG_ENABLE_TABLE_PROCESSING,
            enable_equation_processing=settings.RAG_ENABLE_EQUATION_PROCESSING,
        )

        rag = RAGAnything(
            config=config,
            llm_model_func=get_llm_model_func(),
            vision_model_func=get_vision_model_func(),
            embedding_func=get_embedding_func(),
            lightrag_kwargs={
                "llm_model_name": settings.MODEL_NAME,
                "llm_model_kwargs": {
                    "host": settings.OLLAMA_BASE_URL,
                    "options": {"num_ctx": 8192},
                    "timeout": settings.HTTP_TIMEOUT,
                },
            },
        )

        return cls(rag=rag)

    async def ensure_initialized(self) -> None:
        """Make sure LightRAG storages are initialized (idempotent)."""
        if not self._initialized:
            await self.rag._ensure_lightrag_initialized()
            self._initialized = True

    # ------------------------------------------------------------------
    # Document ingestion
    # ------------------------------------------------------------------

    async def ingest_document(
        self,
        file_path: str,
        *,
        output_dir: str | None = None,
        parse_method: str | None = None,
        doc_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Ingest a single document through RAG-Anything's full pipeline.

        RAG-Anything will:
        1. Parse the document (MinerU/Docling) → text + images + tables
        2. Build entities, relationships, and chunks (knowledge graph)
        3. Embed and store everything in its internal vector + KG storage

        Args:
            file_path: Absolute path to the document.
            output_dir: Where parsed artefacts are written (images, etc.).
            parse_method: Override parse method ("auto", "ocr", "txt").
            doc_id: Optional custom document ID.

        Returns:
            dict with ingestion metadata.
        """
        await self.ensure_initialized()
        settings = get_settings()

        _output = output_dir or settings.RAG_OUTPUT_DIR
        _method = parse_method or settings.RAG_PARSE_METHOD

        logger.info(f"Ingesting document via RAG-Anything: {file_path}")

        try:
            await self.rag.process_document_complete(
                file_path=file_path,
                output_dir=_output,
                parse_method=_method,
                doc_id=doc_id,
            )

            return {
                "status": "ok",
                "file_path": file_path,
                "doc_id": doc_id,
                "method": "raganything",
                "parser": settings.RAG_PARSER,
            }
        except Exception as e:
            logger.error(f"RAG-Anything ingestion failed for {file_path}: {e}", exc_info=True)
            return {
                "status": "error",
                "file_path": file_path,
                "error": str(e),
            }

    async def ingest_content_list(
        self,
        content_list: list[dict[str, Any]],
        *,
        file_path: str = "unknown",
        doc_id: str | None = None,
    ) -> dict[str, Any]:
        """
        Insert pre-parsed content directly (bypass document parsing).

        Useful when text has already been extracted (e.g. via Ollama VLM OCR)
        and you want to inject it into the knowledge graph.

        Args:
            content_list: List of dicts with ``type`` (text/image/table)
                          and corresponding content fields.
            file_path: Reference file path for citation.
            doc_id: Optional document ID.
        """
        await self.ensure_initialized()
        logger.info(f"Inserting content list ({len(content_list)} items) for {file_path}")

        try:
            await self.rag.insert_content_list(
                content_list=content_list,
                file_path=file_path,
                doc_id=doc_id,
                display_stats=False,
            )
            return {"status": "ok", "items": len(content_list), "file_path": file_path}
        except Exception as e:
            logger.error(f"Content list insertion failed: {e}", exc_info=True)
            return {"status": "error", "error": str(e)}

    # ------------------------------------------------------------------
    # Query / retrieval
    # ------------------------------------------------------------------

    async def query(
        self,
        question: str,
        *,
        mode: str = "hybrid",
        vlm_enhanced: bool | None = None,
    ) -> str:
        """
        Ask a natural-language question over the indexed knowledge.

        Modes: "local", "global", "hybrid", "naive", "mix"

        Args:
            question: User query.
            mode: Retrieval mode.
            vlm_enhanced: If True, images in retrieved context are sent
                          to the VLM for analysis. Defaults to True when
                          a vision model is available.

        Returns:
            Generated answer string (with file references).
        """
        await self.ensure_initialized()
        logger.info(f"RAG query (mode={mode}): {question[:80]}…")

        kwargs: dict[str, Any] = {}
        if vlm_enhanced is not None:
            kwargs["vlm_enhanced"] = vlm_enhanced

        result = await self.rag.aquery(question, mode=mode, **kwargs)
        return result

    async def query_with_multimodal(
        self,
        question: str,
        multimodal_content: list[dict[str, Any]],
        *,
        mode: str = "hybrid",
    ) -> str:
        """
        Query with additional multimodal context (e.g. a user-provided table
        or image to compare against indexed knowledge).
        """
        await self.ensure_initialized()
        logger.info(f"Multimodal RAG query (mode={mode}): {question[:80]}…")

        result = await self.rag.aquery_with_multimodal(
            question,
            multimodal_content=multimodal_content,
            mode=mode,
        )
        return result

    # ------------------------------------------------------------------
    # Utilities
    # ------------------------------------------------------------------

    def check_parser(self) -> bool:
        """Check if the document parser (MinerU/Docling) is installed."""
        return self.rag.check_parser_installation()

    def get_info(self) -> dict[str, Any]:
        """Return current configuration and processor information."""
        return {
            "config": self.rag.get_config_info(),
            "processors": self.rag.get_processor_info(),
        }


# ---------------------------------------------------------------------------
# Module-level singleton accessor
# ---------------------------------------------------------------------------


def get_rag_adapter() -> RAGAnythingAdapter:
    """Return (and lazily create) the singleton RAGAnythingAdapter."""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = RAGAnythingAdapter.create()
    return _rag_instance
