from __future__ import annotations

from app.adapters.sqlite.session import session_scope
from app.adapters.sqlite.crud import history_crud
from app.adapters.sqlite.mappers import history_to_domain
from app.core.ports.history_repo import HistoryRepositoryPort
from app.core.domain import OrganizeHistory


class SqliteHistoryRepository(HistoryRepositoryPort):
    def record(
        self,
        file_id: int,
        action_type: str,
        old_path: str | None = None,
        new_path: str | None = None,
        old_name: str | None = None,
        new_name: str | None = None,
        status: str = "success",
    ) -> OrganizeHistory:
        with session_scope() as session:
            row = history_crud.create_organize_history(
                session=session,
                file_id=file_id,
                action_type=action_type,
                old_path=old_path,
                new_path=new_path,
                old_name=old_name,
                new_name=new_name,
                status=status,
            )
            return history_to_domain(row)

    def list_for_file(self, file_id: int):
        with session_scope() as session:
            rows = history_crud.get_history_for_file(session, file_id)
            return [history_to_domain(r) for r in rows]

    def list_recent(self, limit: int = 50):
        with session_scope() as session:
            rows = history_crud.get_recent_history(session, limit=limit)
            return [history_to_domain(r) for r in rows]
