from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class SummaryNoteORM(SQLModel, table=True):
    __tablename__ = "summary_notes"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: int = Field(foreign_key="file_records.id", index=True)
    summary: str
    keywords: Optional[str] = Field(default=None, description="JSON array of keywords")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    file: Optional["FileRecordORM"] = Relationship(back_populates="summary_notes")


from .file_record import FileRecordORM  # noqa: E402
