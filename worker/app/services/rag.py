"""Service for Retrieval-Augmented Generation (RAG) using RAG-Anything.

Replaces the previous LangChain-based RAG chain with RAG-Anything's
graph-aware multimodal retrieval powered by LightRAG.

Key differences from the old pipeline:
- No LangChain chains, retrievers, or document loaders
- Knowledge-graph + vector hybrid retrieval (not vector-only)
- Multimodal support: text, images, tables
- Built-in entity/relationship extraction during ingestion
"""

from __future__ import annotations

from typing import Any

from app.adapters.raganything_adapter import get_rag_adapter
from app.core.logging import get_logger

logger = get_logger(__name__)


async def ingest_document(
    file_path: str,
    *,
    output_dir: str | None = None,
    parse_method: str | None = None,
    doc_id: str | None = None,
) -> dict[str, Any]:
    """
    Ingest a document into the RAG knowledge base.

    RAG-Anything parses the document (MinerU/Docling), extracts multimodal
    content (text + images + tables), builds a knowledge graph, and indexes
    everything for hybrid retrieval.

    Args:
        file_path: Absolute path to the document.
        output_dir: Directory for parsed artefacts.
        parse_method: Parse method override.
        doc_id: Optional document identifier.

    Returns:
        Ingestion result dict.
    """
    adapter = get_rag_adapter()
    return await adapter.ingest_document(
        file_path,
        output_dir=output_dir,
        parse_method=parse_method,
        doc_id=doc_id,
    )


async def ingest_content(
    content: str,
    file_path: str = "unknown",
    doc_id: str | None = None,
) -> dict[str, Any]:
    """
    Ingest pre-extracted text content into the RAG knowledge base.

    This wraps the text into a content list and uses RAG-Anything's
    insert_content_list for direct injection (no document parsing).

    Args:
        content: Raw text to ingest.
        file_path: Reference file path for citation.
        doc_id: Optional document identifier.
    """
    adapter = get_rag_adapter()
    content_list = [
        {"type": "text", "text": content, "page_idx": 0},
    ]
    return await adapter.ingest_content_list(
        content_list,
        file_path=file_path,
        doc_id=doc_id,
    )


async def query_rag(
    question: str,
    *,
    mode: str = "hybrid",
    vlm_enhanced: bool | None = None,
) -> str:
    """
    Query the RAG knowledge base with a natural-language question.

    Modes:
    - "local"  : focus on directly connected entities
    - "global" : broad cross-document reasoning
    - "hybrid" : combined local + global (recommended)
    - "naive"  : simple chunk retrieval (no graph)
    - "mix"    : combination of all modes

    Args:
        question: User's question.
        mode: Retrieval mode.
        vlm_enhanced: If True, VLM analyses images in retrieved context.

    Returns:
        Generated answer string with file references.
    """
    adapter = get_rag_adapter()
    return await adapter.query(question, mode=mode, vlm_enhanced=vlm_enhanced)


async def query_rag_multimodal(
    question: str,
    multimodal_content: list[dict[str, Any]],
    *,
    mode: str = "hybrid",
) -> str:
    """
    Query with additional multimodal context (e.g. a table or image the
    user provides alongside the question).
    """
    adapter = get_rag_adapter()
    return await adapter.query_with_multimodal(
        question,
        multimodal_content=multimodal_content,
        mode=mode,
    )