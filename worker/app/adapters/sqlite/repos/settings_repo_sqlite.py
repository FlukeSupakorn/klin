from __future__ import annotations

from app.adapters.sqlite.session import session_scope
from app.adapters.sqlite.crud import settings_crud
from app.adapters.sqlite.mappers import (
    folder_mapping_to_domain,
    user_setting_to_domain,
)
from app.core.ports.settings_repo import SettingsRepositoryPort
from app.core.domain import FolderMapping, UserSetting


class SqliteSettingsRepository(SettingsRepositoryPort):
    def get_user_settings(self) -> UserSetting | None:
        with session_scope() as session:
            row = settings_crud.get_user_settings(session)
            return user_setting_to_domain(row) if row else None

    def update_user_settings(self, **fields) -> UserSetting:
        with session_scope() as session:
            row = settings_crud.update_user_settings(session, **fields)
            return user_setting_to_domain(row)

    def get_folder_mapping(self, category: str) -> FolderMapping | None:
        with session_scope() as session:
            row = settings_crud.get_folder_mapping(session, category)
            return folder_mapping_to_domain(row) if row else None

    def list_folder_mappings(self):
        with session_scope() as session:
            rows = settings_crud.get_all_folder_mappings(session)
            return [folder_mapping_to_domain(r) for r in rows]

    def upsert_folder_mapping(self, category: str, destination_path: str) -> FolderMapping:
        with session_scope() as session:
            row = settings_crud.update_folder_mapping(session, category, destination_path)
            return folder_mapping_to_domain(row)
