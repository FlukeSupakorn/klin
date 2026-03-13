"""ORM → domain entity mappers."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from app.adapters.sqlite.models.file_record import FileRecordORM


@dataclass(slots=True)
class FileRecord:
    """Domain entity for a tracked file."""
    id: int | None
    original_path: str
    filename: str
    current_path: str | None = None
    new_filename: str | None = None
    file_hash: str | None = None
    category: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


def file_record_to_domain(row: FileRecordORM) -> FileRecord:
    return FileRecord(
        id=row.id,
        original_path=row.original_path,
        filename=row.filename,
        current_path=row.current_path,
        new_filename=row.new_filename,
        file_hash=row.file_hash,
        category=row.category,
        created_at=row.created_at,
        updated_at=row.updated_at,
    )
