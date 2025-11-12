"""File ingestion service - orchestrates text extraction."""
import mimetypes
import os
from pathlib import Path
from typing import Dict, Any
from pydantic import BaseModel

from app.adapters.ollama_vlm import extract_text_with_llm
from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.ingest import IngestOptions
from app.utils import calculate_sha256, is_allowed_extension, get_file_size_mb

logger = get_logger(__name__)


class IngestionResult(BaseModel):
    """Internal result of file ingestion (with extracted text)."""
    file_sha256: str | None = None
    origin_path: str
    status: str
    error: str | None = None
    meta: Dict[str, Any] | None = None
    extracted_text: str | None = None


async def process_single_file(
    file_path: str,
    options: IngestOptions,
) -> IngestionResult:
    """
    Process a single file for text extraction using LLM-based OCR.
    
    Args:
        file_path: Path to the file
        options: Processing options
        
    Returns:
        IngestionResult with extracted text and metadata
    """
    settings = get_settings()
    
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            return IngestionResult(
                file_sha256="",
                origin_path=file_path,
                status="error",
                error="File not found"
            )
        
        # Check file size
        file_size_mb = get_file_size_mb(file_path)
        max_size = options.max_file_size_mb or settings.MAX_FILE_SIZE_MB
        
        if file_size_mb > max_size:
            return IngestionResult(
                file_sha256="",
                origin_path=file_path,
                status="error",
                error=f"File size ({file_size_mb:.2f}MB) exceeds maximum ({max_size}MB)"
            )
        
        # Get file info
        extension = Path(file_path).suffix.lower()
        mime_type, _ = mimetypes.guess_type(file_path)
        mime_type = mime_type or "application/octet-stream"
        
        # Check if extension is allowed
        if not is_allowed_extension(file_path, settings.ALLOWED_EXTENSIONS):
            return IngestionResult(
                file_sha256="",
                origin_path=file_path,
                status="unsupported",
                error=f"File type {extension} is not supported"
            )
        
        # Calculate file hash
        sha256 = calculate_sha256(file_path)
        file_size_bytes = os.path.getsize(file_path)
        
        # Check if LLM OCR is allowed
        if not options.allow_vlm_ocr:
            return IngestionResult(
                file_sha256="",
                origin_path=file_path,
                status="skipped",
                error="LLM OCR is disabled in options"
            )
        
        # Extract text using LLM for ALL file types
        logger.info(f"Using LLM-based extraction for: {file_path}")
        extracted_text, extraction_metadata = await extract_text_with_llm(
            file_path, mime_type
        )
        
        # Build metadata
        metadata = {
            "mime_type": mime_type,
            "size_bytes": file_size_bytes,
            "sha256": sha256,
            "extension": extension,
            **extraction_metadata,  # Include LLM metadata (model, duration, etc.)
        }
        
        return IngestionResult(
            file_sha256=sha256,
            origin_path=file_path,
            status="ok",
            meta=metadata,
            extracted_text=extracted_text,
        )
        
    except Exception as e:
        logger.error(f"Error processing file {file_path}: {e}", exc_info=True)
        return IngestionResult(
            file_sha256="",
            origin_path=file_path,
            status="error",
            error=str(e)
        )


async def process_files(
    file_paths: list[str],
    options: IngestOptions,
) -> list[IngestionResult]:
    """
    Process multiple files, optionally traversing directories.
    
    Args:
        file_paths: List of file or directory paths
        options: Processing options
        
    Returns:
        List of IngestionResults
    """
    settings = get_settings()
    all_files: list[str] = []
    
    # Expand directories if traverse_folders is enabled
    for path in file_paths:
        if os.path.isfile(path):
            all_files.append(path)
        elif os.path.isdir(path) and options.traverse_folders:
            logger.info(f"Traversing directory: {path}")
            for root, _, files in os.walk(path):
                for file in files:
                    file_path = os.path.join(root, file)
                    if is_allowed_extension(file_path, settings.ALLOWED_EXTENSIONS):
                        all_files.append(file_path)
        else:
            logger.warning(f"Skipping path (not a file or directory): {path}")
    
    logger.info(f"Processing {len(all_files)} files")
    
    # Process each file
    results = []
    for file_path in all_files:
        result = await process_single_file(file_path, options)
        results.append(result)
    
    return results
