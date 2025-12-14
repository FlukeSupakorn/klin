from __future__ import annotations

from app.adapters.sqlite.session import session_scope
from app.adapters.sqlite.crud import file_crud
from app.adapters.sqlite.mappers import file_record_to_domain
from app.adapters.sqlite.models.file_record import FileRecordORM
from app.core.ports.file_repo import FileRepositoryPort
from app.core.domain import FileRecord


class SqliteFileRepository(FileRepositoryPort):
    def create(
        self,
        original_path: str,
        filename: str,
        file_hash: str | None = None,
        category: str | None = None,
    ) -> FileRecord:
        with session_scope() as session:
            row = file_crud.create_file_record(
                session=session,
                original_path=original_path,
                filename=filename,
                file_hash=file_hash,
                category=category,
            )
            return file_record_to_domain(row)

    def get(self, file_id: int) -> FileRecord | None:
        with session_scope() as session:
            row = file_crud.get_file_record(session, file_id)
            return file_record_to_domain(row) if row else None

    def get_by_hash(self, file_hash: str) -> FileRecord | None:
        with session_scope() as session:
            row = file_crud.get_file_by_hash(session, file_hash)
            return file_record_to_domain(row) if row else None

    def get_by_path(self, path: str) -> FileRecord | None:
        with session_scope() as session:
            row = file_crud.get_file_by_path(session, path)
            return file_record_to_domain(row) if row else None

    def list_by_category(self, category: str):
        with session_scope() as session:
            rows = file_crud.get_files_by_category(session, category)
            return [file_record_to_domain(r) for r in rows]

    def update(self, file_id: int, **fields) -> FileRecord | None:
        with session_scope() as session:
            row = file_crud.update_file_record(session, file_id, **fields)
            return file_record_to_domain(row) if row else None

    def delete(self, file_id: int) -> bool:
        with session_scope() as session:
            return file_crud.delete_file_record(session, file_id)
