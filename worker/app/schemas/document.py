"""Schemas for document ingestion and retrieval (RAG-Anything)."""
from pydantic import BaseModel, Field
from typing import Any


# ---------------------------------------------------------------------------
# Ingestion
# ---------------------------------------------------------------------------

class DocumentIngestRequest(BaseModel):
    """Request to ingest a document via RAG-Anything's full parsing pipeline."""
    file_path: str = Field(..., description="Absolute path to the document to ingest.")
    output_dir: str | None = Field(None, description="Output directory for parsed artefacts.")
    parse_method: str | None = Field(None, description="Parse method: auto, ocr, txt.")
    doc_id: str | None = Field(None, description="Optional custom document ID.")


class ContentIngestRequest(BaseModel):
    """Request to ingest pre-extracted text content (no document parsing)."""
    file_path: str = Field(..., description="Reference file path for citation.")
    content: str = Field(..., description="The text content to ingest.")
    doc_id: str | None = Field(None, description="Optional custom document ID.")


class DocumentIngestResponse(BaseModel):
    """Response from document ingestion."""
    success: bool = Field(..., description="Whether the ingestion succeeded.")
    message: str = Field(..., description="Human-readable status message.")
    details: dict[str, Any] | None = Field(None, description="Additional ingestion metadata.")


# ---------------------------------------------------------------------------
# Search / Query
# ---------------------------------------------------------------------------

class DocumentSearchRequest(BaseModel):
    """Request to query the RAG knowledge base."""
    query: str = Field(..., description="Natural language question.")
    mode: str = Field("hybrid", description="Retrieval mode: local, global, hybrid, naive, mix.")
    vlm_enhanced: bool | None = Field(None, description="Enable VLM analysis of images in context.")


class MultimodalSearchRequest(BaseModel):
    """Request to query with additional multimodal context."""
    query: str = Field(..., description="Natural language question.")
    multimodal_content: list[dict[str, Any]] = Field(
        ..., description="List of multimodal content items (table/image) to include in the query."
    )
    mode: str = Field("hybrid", description="Retrieval mode.")


class DocumentSearchResponse(BaseModel):
    """Response from document search/query."""
    answer: str = Field(..., description="Generated answer.")
    mode: str = Field(..., description="Retrieval mode used.")


# ---------------------------------------------------------------------------
# Info
# ---------------------------------------------------------------------------

class RAGInfoResponse(BaseModel):
    """Response with RAG system information."""
    parser_installed: bool
    config: dict[str, Any]
    processors: dict[str, Any]
