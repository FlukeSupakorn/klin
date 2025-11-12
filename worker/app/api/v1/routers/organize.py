"""Organize API endpoint - generates file organization plans."""
import uuid
from fastapi import APIRouter, HTTPException

from app.core.logging import get_logger
from app.schemas.organize import OrganizeRequest, OrganizeResponse
from app.services.planning import organize_files

logger = get_logger(__name__)

router = APIRouter(prefix="/v1", tags=["organize"])


@router.post("/organize", response_model=OrganizeResponse)
async def organize(request: OrganizeRequest) -> OrganizeResponse:
    """
    Generate organization plans for files.
    
    This endpoint:
    1. Ingests files (extracts text via OCR/parsers)
    2. Analyzes content using LLM
    3. Generates move/rename/duplicate suggestions
    4. Optionally creates summaries
    
    The worker NEVER moves files - it only returns plans.
    Tauri frontend executes the actual file operations.
    
    Args:
        request: OrganizeRequest with files, destinations, and options
        
    Returns:
        OrganizeResponse with action plans for each file
    """
    request_id = f"org_{uuid.uuid4().hex[:12]}"
    
    logger.info(
        f"[{request_id}] Starting organize request",
        extra={
            "request_id": request_id,
            "file_count": len(request.files),
            "destinations_count": len(request.destinations) if request.destinations else 0,
            "options": request.options.model_dump(),
        }
    )
    
    try:
        # Extract file paths
        file_paths = [f.path for f in request.files]
        
        # Extract destination paths (use empty list if not provided)
        # TODO: Get destination paths from db or other source
        destinations = []
        if request.destinations:
            destinations = [d.path for d in request.destinations]
        
        # Generate organization plans
        results = await organize_files(file_paths, destinations, request.options)
        
        logger.info(
            f"[{request_id}] Organization complete",
            extra={
                "request_id": request_id,
                "total": len(results),
                "successful": sum(1 for r in results if r.status == "ok"),
                "failed": sum(1 for r in results if r.status == "error"),
            }
        )
        
        return OrganizeResponse(
            request_id=request_id,
            results=results,
        )
        
    except Exception as e:
        logger.error(
            f"[{request_id}] Critical error during organization: {e}",
            exc_info=True,
            extra={"request_id": request_id}
        )
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during organization: {str(e)}"
        )
