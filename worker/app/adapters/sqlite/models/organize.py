from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


class OrganizePlanORM(SQLModel, table=True):
    __tablename__ = "organize_plans"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: int = Field(foreign_key="file_records.id", index=True)
    action_type: str = Field(description="move / rename / delete / summary")
    suggested_path: Optional[str] = Field(default=None)
    suggested_name: Optional[str] = Field(default=None)
    reason: Optional[str] = Field(default=None, description="LLM explanation")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    file: Optional["FileRecordORM"] = Relationship(back_populates="organize_plans")


class OrganizeHistoryORM(SQLModel, table=True):
    __tablename__ = "organize_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: int = Field(foreign_key="file_records.id", index=True)
    old_path: Optional[str] = Field(default=None)
    new_path: Optional[str] = Field(default=None)
    old_name: Optional[str] = Field(default=None)
    new_name: Optional[str] = Field(default=None)
    action_type: str = Field(description="move / rename / delete")
    status: str = Field(default="success", description="success / failed")
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)

    file: Optional["FileRecordORM"] = Relationship(back_populates="organize_history")


class DuplicateRecordORM(SQLModel, table=True):
    __tablename__ = "duplicate_records"

    id: Optional[int] = Field(default=None, primary_key=True)
    file_id: int = Field(foreign_key="file_records.id", index=True)
    duplicate_of: int = Field(index=True, description="file_id of original")
    similarity_score: float = Field(default=1.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    file: Optional["FileRecordORM"] = Relationship(back_populates="duplicate_records")


from .file_record import FileRecordORM  # noqa: E402
