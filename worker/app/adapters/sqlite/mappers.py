from __future__ import annotations

from app.adapters.sqlite.models.file_record import FileRecordORM
from app.adapters.sqlite.models.organize import OrganizeHistoryORM
from app.adapters.sqlite.models.settings import FolderMappingORM, UserSettingORM
from app.core.domain import FileRecord, FolderMapping, OrganizeHistory, UserSetting


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


def history_to_domain(row: OrganizeHistoryORM) -> OrganizeHistory:
    return OrganizeHistory(
        id=row.id,
        file_id=row.file_id,
        action_type=row.action_type,
        old_path=row.old_path,
        new_path=row.new_path,
        old_name=row.old_name,
        new_name=row.new_name,
        status=row.status,
        timestamp=row.timestamp,
    )


def folder_mapping_to_domain(row: FolderMappingORM) -> FolderMapping:
    return FolderMapping(id=row.id, category=row.category, destination_path=row.destination_path)


def user_setting_to_domain(row: UserSettingORM) -> UserSetting:
    return UserSetting(
        id=row.id,
        watcher_folders=row.watcher_folders,
        destination_folders=row.destination_folders,
        llm_config=row.llm_config,
        preferences=row.preferences,
    )
