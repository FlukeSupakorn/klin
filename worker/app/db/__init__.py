"""Database composition layer.

This project uses two storage backends:
- SQLite (SQLModel) for relational data
- LanceDB for vector embeddings / semantic search

This module exposes:
- `init_db()` for app startup
- `get_lancedb_dir()` for runtime path
- Re-exports container getters for convenience
"""

from __future__ import annotations

from pathlib import Path

from app.db.manager import build_database_manager

APP_DIR = Path(__file__).resolve().parent.parent  # app/
WORKER_DIR = APP_DIR.parent  # worker/
RUNTIME_DB_DIR = WORKER_DIR / "db"


def init_db() -> None:
    """Initialize required databases (SQLite tables + storage dirs)."""
    manager = build_database_manager(app_dir=APP_DIR)
    manager.init_all()
    (RUNTIME_DB_DIR / "sqlite").mkdir(parents=True, exist_ok=True)
    (RUNTIME_DB_DIR / "lancedb").mkdir(parents=True, exist_ok=True)


def get_lancedb_dir() -> Path:
    """Return the configured on-disk LanceDB directory."""
    return RUNTIME_DB_DIR / "lancedb"


# Re-export container getters for convenience
from app.core.container import (  # noqa: E402, F401
    container,
    get_container,
    get_file_repo,
    get_history_repo,
    get_settings_repo,
    get_vector_index,
)


