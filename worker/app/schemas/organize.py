"""Schemas for organize endpoint."""
from pydantic import BaseModel

from app.schemas.common import FilePath, Destination, Envelope


class OrganizeOptions(BaseModel):
    """Options for organize operation."""
    make_summaries: bool = False
    allow_renames: bool = True
    allow_duplicates: bool = True
    max_tokens_per_file: int = 8000
    allow_vlm_ocr: bool = True


class OrganizeRequest(BaseModel):
    """Request to organize files."""
    files: list[FilePath]
    destinations: list[Destination] | None = None
    options: OrganizeOptions = OrganizeOptions()


class OrganizeResponse(Envelope):
    """Response from organize endpoint."""
    pass
