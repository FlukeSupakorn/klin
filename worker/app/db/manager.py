from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from app.adapters.lancedb.vector_index_lance import LanceVectorIndex
from app.adapters.sqlite.repos.file_repo_sqlite import SqliteFileRepository
from app.adapters.sqlite.repos.history_repo_sqlite import SqliteHistoryRepository
from app.adapters.sqlite.repos.settings_repo_sqlite import SqliteSettingsRepository
from app.core.ports.file_repo import FileRepositoryPort
from app.core.ports.history_repo import HistoryRepositoryPort
from app.core.ports.settings_repo import SettingsRepositoryPort
from app.core.ports.vector_index import VectorIndexPort
from app.adapters.sqlite.database import init_db as init_sqlite_db


@dataclass(frozen=True)
class DatabaseManager:
    file_repo: FileRepositoryPort
    history_repo: HistoryRepositoryPort
    settings_repo: SettingsRepositoryPort
    vector_index: VectorIndexPort

    def init_all(self) -> None:
        # SQLite tables
        init_sqlite_db()
        # LanceDB directory/table will be created lazily by adapter


def build_database_manager(app_dir: Path | None = None) -> DatabaseManager:
    base_dir = app_dir or Path(__file__).resolve().parent.parent  # app/
    worker_dir = base_dir.parent  # worker/
    lancedb_dir = worker_dir / "db" / "lancedb"

    return DatabaseManager(
        file_repo=SqliteFileRepository(),
        history_repo=SqliteHistoryRepository(),
        settings_repo=SqliteSettingsRepository(),
        vector_index=LanceVectorIndex(db_dir=lancedb_dir, table_name="Files"),
    )
