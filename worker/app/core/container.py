"""Dependency injection container.

Provides FastAPI Depends()-compatible getters for repositories.

Usage:
    from app.core.container import get_file_repo

    @router.get("/files/{file_id}")
    async def get_file(file_id: int, repo = Depends(get_file_repo)):
        return repo.get(file_id)
"""

from __future__ import annotations

from functools import lru_cache
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.core.ports.file_repo import FileRepositoryPort


@lru_cache(maxsize=1)
def _get_file_repo_instance() -> "FileRepositoryPort":
    """Lazily create and cache the file repository singleton."""
    from app.adapters.sqlite.repos.file_repo_sqlite import SqliteFileRepository
    return SqliteFileRepository()


def get_file_repo() -> "FileRepositoryPort":
    """FastAPI Depends() getter for the file repository."""
    return _get_file_repo_instance()
