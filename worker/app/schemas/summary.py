"""Schemas for summaries endpoint."""
from pydantic import BaseModel

from app.schemas.common import FilePath, Envelope


class SummaryOptions(BaseModel):
    """Options for summary generation."""
    style: str = "bullet"  # "bullet" | "paragraph"
    max_chars: int = 2000


class SummaryRequest(BaseModel):
    """Request to generate summaries."""
    files: list[FilePath]
    options: SummaryOptions = SummaryOptions()


class SummaryResponse(Envelope):
    """Response from summaries endpoint."""
    pass
