from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class CalendarEventORM(SQLModel, table=True):
    __tablename__ = "calendar_events"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: int = Field(foreign_key="file_records.id", index=True)
    title: str
    event_date: datetime
    description: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    file: Optional["FileRecordORM"] = Relationship(back_populates="calendar_events")


from .file_record import FileRecordORM  # noqa: E402
