"""Organize planner service - generates file organization plans."""
import uuid
from typing import Dict, Any, TYPE_CHECKING

from app.core.logging import get_logger
from app.schemas.common import ItemResult, PlanAction
from app.schemas.organize import OrganizeOptions
from app.services.ingestion import process_single_file, IngestionResult, IngestOptions

if TYPE_CHECKING:
    from app.core.ports.file_repo import FileRepositoryPort

logger = get_logger(__name__)


async def generate_plan_for_file(
    file_path: str,
    destinations: list[str],
    options: OrganizeOptions,
    file_repo: "FileRepositoryPort | None" = None,
) -> ItemResult:
    """
    Generate an organization plan for a single file.
    
    This function:
    1. Ingests the file (extracts text)
    2. Analyzes content
    3. Generates move/rename/duplicate suggestions
    
    Args:
        file_path: Path to the file
        destinations: List of allowed destination paths
        options: Organization options
        file_repo: Optional file repository for duplicate checking
        
    Returns:
        ItemResult with action plan
    """
    # Step 1: Ingest the file (extract text)
    ingest_options = IngestOptions(
        allow_vlm_ocr=options.allow_vlm_ocr,
        max_file_size_mb=None,
        traverse_folders=False
    )
    
    ingestion_result = await process_single_file(file_path, ingest_options, file_repo=file_repo)
    
    # If ingestion failed, return the error
    if ingestion_result.status != "ok":
        return ItemResult(
            file_sha256=ingestion_result.file_sha256 or "",
            origin_path=file_path,
            status=ingestion_result.status,
            error=ingestion_result.error,
            meta=ingestion_result.meta,
        )
    
    # Step 2: Analyze and generate plan
    # TODO: Call LLM to analyze text and generate plan
    # For now, return a basic plan
    
    extracted_text = ingestion_result.extracted_text or ""
    file_sha256 = ingestion_result.file_sha256 or ""
    
    # Simple heuristic plan (placeholder - will be replaced with LLM)
    action = PlanAction(
        move=destinations[0] if destinations else None,
        rename=None,  # Will be set by LLM
        duplicate_of=None,  # Will check DB for duplicates
        summary=None,  # Will be set if make_summaries=True
        confidence=0.5,  # Placeholder
        reason="Automatic organization (LLM not yet implemented)"
    )
    
    # Generate summary if requested
    if options.make_summaries and extracted_text:
        # TODO: Call LLM to generate summary
        preview = extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text
        action.summary = f"Document preview:\n{preview}"
    
    return ItemResult(
        file_sha256=file_sha256,
        origin_path=file_path,
        status="ok",
        action=action,
        meta=ingestion_result.meta,
    )


async def organize_files(
    file_paths: list[str],
    destinations: list[str],
    options: OrganizeOptions,
    file_repo: "FileRepositoryPort | None" = None,
) -> list[ItemResult]:
    """
    Generate organization plans for multiple files.
    
    Args:
        file_paths: List of file paths to organize
        destinations: List of allowed destination paths
        options: Organization options
        file_repo: Optional file repository for duplicate checking
        
    Returns:
        List of ItemResults with action plans
    """
    logger.info(f"Organizing {len(file_paths)} files with {len(destinations)} destinations")
    
    results = []
    for file_path in file_paths:
        result = await generate_plan_for_file(file_path, destinations, options, file_repo=file_repo)
        results.append(result)
    
    return results
