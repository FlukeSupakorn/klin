"""Schemas for file ingestion endpoints."""
from typing import Any
from pydantic import BaseModel, Field

from app.schemas.common import FilePath, Envelope, ItemResult


class IngestOptions(BaseModel):
    """Options for file ingestion."""
    allow_vlm_ocr: bool = True
    max_file_size_mb: int | None = None
    traverse_folders: bool = True


class IngestRequest(BaseModel):
    """Request to ingest files for text extraction."""
    files: list[FilePath] = Field(
        ..., 
        description="List of file paths to process",
        min_length=1
    )
    options: IngestOptions = IngestOptions()


class IngestResponse(Envelope):
    """Response from ingestion endpoint."""
    total_files: int = Field(..., description="Total number of files processed")
    successful: int = Field(..., description="Number of successfully processed files")
    failed: int = Field(..., description="Number of failed files")
