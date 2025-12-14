from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(slots=True)
class FileRecord:
    id: int | None
    original_path: str
    filename: str
    current_path: str | None = None
    new_filename: str | None = None
    file_hash: str | None = None
    category: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


@dataclass(slots=True)
class OrganizeHistory:
    id: int | None
    file_id: int
    action_type: str
    old_path: str | None = None
    new_path: str | None = None
    old_name: str | None = None
    new_name: str | None = None
    status: str = "success"
    timestamp: datetime | None = None


@dataclass(slots=True)
class FolderMapping:
    id: int | None
    category: str
    destination_path: str


@dataclass(slots=True)
class UserSetting:
    id: int | None
    watcher_folders: str | None = None
    destination_folders: str | None = None
    llm_config: str | None = None
    preferences: str | None = None
