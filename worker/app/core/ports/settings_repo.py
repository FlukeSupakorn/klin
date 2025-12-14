from __future__ import annotations

from typing import Protocol, Sequence

from app.core.domain import FolderMapping, UserSetting


class SettingsRepositoryPort(Protocol):
    def get_user_settings(self) -> UserSetting | None: ...

    def update_user_settings(self, **fields) -> UserSetting: ...

    def get_folder_mapping(self, category: str) -> FolderMapping | None: ...

    def list_folder_mappings(self) -> Sequence[FolderMapping]: ...

    def upsert_folder_mapping(self, category: str, destination_path: str) -> FolderMapping: ...
