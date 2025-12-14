from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class FileRecordORM(SQLModel, table=True):
    __tablename__ = "file_records"

    id: Optional[int] = Field(default=None, primary_key=True)
    original_path: str = Field(index=True, description="Absolute path before organizing")
    current_path: Optional[str] = Field(default=None, description="Path after organizing")
    filename: str = Field(description="Original file name")
    new_filename: Optional[str] = Field(default=None, description="AI suggested name")
    file_hash: Optional[str] = Field(
        default=None, index=True, description="SHA-256 for duplicate detection"
    )
    category: Optional[str] = Field(
        default=None, index=True, description="AI-classified document category"
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    organize_plans: list["OrganizePlanORM"] = Relationship(back_populates="file")
    organize_history: list["OrganizeHistoryORM"] = Relationship(back_populates="file")
    duplicate_records: list["DuplicateRecordORM"] = Relationship(back_populates="file")
    summary_notes: list["SummaryNoteORM"] = Relationship(back_populates="file")
    calendar_events: list["CalendarEventORM"] = Relationship(back_populates="file")


# Forward refs for SQLModel relationship typing
from .organize import DuplicateRecordORM, OrganizeHistoryORM, OrganizePlanORM  # noqa: E402
from .embeddings import SummaryNoteORM  # noqa: E402
from .calendar import CalendarEventORM  # noqa: E402
