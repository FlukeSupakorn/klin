from __future__ import annotations

from typing import Protocol, Sequence

from app.core.domain import OrganizeHistory


class HistoryRepositoryPort(Protocol):
    def record(
        self,
        file_id: int,
        action_type: str,
        old_path: str | None = None,
        new_path: str | None = None,
        old_name: str | None = None,
        new_name: str | None = None,
        status: str = "success",
    ) -> OrganizeHistory: ...

    def list_for_file(self, file_id: int) -> Sequence[OrganizeHistory]: ...

    def list_recent(self, limit: int = 50) -> Sequence[OrganizeHistory]: ...
