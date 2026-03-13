"""API endpoints for document ingestion and search (RAG-Anything).

Replaces the previous LangChain-based RAG chain + LanceDB vector store
with RAG-Anything's multimodal knowledge-graph pipeline.
"""
from fastapi import APIRouter, HTTPException

from app.schemas.document import (
    DocumentIngestRequest,
    ContentIngestRequest,
    DocumentIngestResponse,
    DocumentSearchRequest,
    DocumentSearchResponse,
    MultimodalSearchRequest,
    RAGInfoResponse,
)
from app.services.rag import (
    ingest_document,
    ingest_content,
    query_rag,
    query_rag_multimodal,
)
from app.adapters.raganything_adapter import get_rag_adapter
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/ingest", response_model=DocumentIngestResponse)
async def ingest_document_endpoint(request: DocumentIngestRequest):
    """
    Ingest a document via RAG-Anything's full parsing pipeline.

    The document is parsed (MinerU/Docling), multimodal content is extracted
    (text, images, tables), a knowledge graph is built, and everything is
    indexed for hybrid retrieval.
    """
    result = await ingest_document(
        request.file_path,
        output_dir=request.output_dir,
        parse_method=request.parse_method,
        doc_id=request.doc_id,
    )
    success = result.get("status") == "ok"
    return DocumentIngestResponse(
        success=success,
        message="Document ingested successfully." if success else f"Ingestion failed: {result.get('error', 'unknown')}",
        details=result,
    )


@router.post("/ingest/content", response_model=DocumentIngestResponse)
async def ingest_content_endpoint(request: ContentIngestRequest):
    """
    Ingest pre-extracted text content directly (no document parsing).

    Useful when text has already been extracted via Ollama VLM OCR
    and you want to add it to the RAG knowledge base.
    """
    result = await ingest_content(
        request.content,
        file_path=request.file_path,
        doc_id=request.doc_id,
    )
    success = result.get("status") == "ok"
    return DocumentIngestResponse(
        success=success,
        message="Content ingested successfully." if success else f"Ingestion failed: {result.get('error', 'unknown')}",
        details=result,
    )


@router.post("/search", response_model=DocumentSearchResponse)
async def search_documents(request: DocumentSearchRequest):
    """
    Query the RAG knowledge base with a natural-language question.

    Returns an LLM-generated answer grounded in the indexed documents,
    with file references and optional VLM image analysis.
    """
    try:
        answer = await query_rag(
            request.query,
            mode=request.mode,
            vlm_enhanced=request.vlm_enhanced,
        )
        return DocumentSearchResponse(answer=answer, mode=request.mode)
    except Exception as e:
        logger.error(f"Search failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/search/multimodal", response_model=DocumentSearchResponse)
async def search_documents_multimodal(request: MultimodalSearchRequest):
    """
    Query with additional multimodal context (e.g. a user-provided table
    or image to compare against indexed knowledge).
    """
    try:
        answer = await query_rag_multimodal(
            request.query,
            multimodal_content=request.multimodal_content,
            mode=request.mode,
        )
        return DocumentSearchResponse(answer=answer, mode=request.mode)
    except Exception as e:
        logger.error(f"Multimodal search failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/rag/info", response_model=RAGInfoResponse)
async def get_rag_info():
    """Return RAG system configuration and processor information."""
    adapter = get_rag_adapter()
    info = adapter.get_info()
    return RAGInfoResponse(
        parser_installed=adapter.check_parser(),
        config=info.get("config", {}),
        processors=info.get("processors", {}),
    )
