from __future__ import annotations

from typing import Protocol, Sequence

from app.core.domain import FileRecord


class FileRepositoryPort(Protocol):
    def create(
        self,
        original_path: str,
        filename: str,
        file_hash: str | None = None,
        category: str | None = None,
    ) -> FileRecord: ...

    def get(self, file_id: int) -> FileRecord | None: ...

    def get_by_hash(self, file_hash: str) -> FileRecord | None: ...

    def get_by_path(self, path: str) -> FileRecord | None: ...

    def list_by_category(self, category: str) -> Sequence[FileRecord]: ...

    def update(self, file_id: int, **fields) -> FileRecord | None: ...

    def delete(self, file_id: int) -> bool: ...
