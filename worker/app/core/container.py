"""Dependency injection container.

This module provides a singleton container that wires together
all adapters (repositories, vector index) and exposes them via
typed getters for use in services and API routes.

Usage in FastAPI routes:
    from app.core.container import get_file_repo, get_vector_index
    
    @router.get("/files/{file_id}")
    async def get_file(file_id: int, repo: FileRepositoryPort = Depends(get_file_repo)):
        return repo.get(file_id)

Usage in services:
    from app.core.container import container
    
    file_repo = container.file_repo
    result = file_repo.get_by_hash(sha256)
"""

from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from app.db.manager import DatabaseManager
    from app.core.ports.file_repo import FileRepositoryPort
    from app.core.ports.history_repo import HistoryRepositoryPort
    from app.core.ports.settings_repo import SettingsRepositoryPort
    from app.core.ports.vector_index import VectorIndexPort


@lru_cache(maxsize=1)
def get_container() -> "DatabaseManager":
    """Return the singleton DatabaseManager (lazy-initialized)."""
    # Import here to avoid circular imports
    from app.db.manager import build_database_manager
    return build_database_manager()


# ---------------------------------------------------------------------------
# FastAPI Depends()-compatible getters
# ---------------------------------------------------------------------------


def get_file_repo() -> "FileRepositoryPort":
    """Dependency: returns the file repository."""
    return get_container().file_repo


def get_history_repo() -> "HistoryRepositoryPort":
    """Dependency: returns the history repository."""
    return get_container().history_repo


def get_settings_repo() -> "SettingsRepositoryPort":
    """Dependency: returns the settings repository."""
    return get_container().settings_repo


def get_vector_index() -> "VectorIndexPort":
    """Dependency: returns the vector index (LanceDB)."""
    return get_container().vector_index


# ---------------------------------------------------------------------------
# For direct imports in services
# ---------------------------------------------------------------------------


class _ContainerProxy:
    """Proxy object that lazily accesses the singleton container."""

    @property
    def file_repo(self) -> "FileRepositoryPort":
        return get_container().file_repo

    @property
    def history_repo(self) -> "HistoryRepositoryPort":
        return get_container().history_repo

    @property
    def settings_repo(self) -> "SettingsRepositoryPort":
        return get_container().settings_repo

    @property
    def vector_index(self) -> "VectorIndexPort":
        return get_container().vector_index


container = _ContainerProxy()
