"""Common schemas shared across the application."""
from typing import Literal, Any
from pydantic import BaseModel, Field


class FilePath(BaseModel):
    """Represents a file path."""
    path: str


class Destination(BaseModel):
    """Represents a destination folder."""
    path: str


class PlanAction(BaseModel):
    """Action plan for a file."""
    move: str | None = None  # destination path from whitelist
    rename: str | None = None  # sanitized filename only (no path)
    duplicate_of: str | None = None  # sha256 of original file (if dup)
    summary: str | None = None  # optional markdown summary
    confidence: float | None = None  # 0..1
    reason: str | None = None  # short rationale


class ItemResult(BaseModel):
    """Result of processing a single file."""
    file_sha256: str
    origin_path: str
    status: Literal["ok", "skipped", "unsupported", "error"]
    action: PlanAction | None = None
    error: str | None = None
    meta: dict[str, Any] | None = None  # mime, bytes, pages, etc.


class Envelope(BaseModel):
    """Standard response envelope."""
    request_id: str
    results: list[ItemResult]
