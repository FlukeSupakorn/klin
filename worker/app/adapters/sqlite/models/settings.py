from __future__ import annotations

from typing import Optional

from sqlmodel import Field, SQLModel


class FolderMappingORM(SQLModel, table=True):
    __tablename__ = "folder_mappings"

    id: Optional[int] = Field(default=None, primary_key=True)
    category: str = Field(index=True, unique=True)
    destination_path: str


class UserSettingORM(SQLModel, table=True):
    __tablename__ = "user_settings"

    id: Optional[int] = Field(default=None, primary_key=True)
    watcher_folders: Optional[str] = Field(
        default=None, description="JSON array of folder paths"
    )
    destination_folders: Optional[str] = Field(
        default=None, description="JSON array of folder paths"
    )
    llm_config: Optional[str] = Field(
        default=None, description="JSON object with LLM model settings"
    )
    preferences: Optional[str] = Field(
        default=None, description="JSON object with user preferences"
    )
