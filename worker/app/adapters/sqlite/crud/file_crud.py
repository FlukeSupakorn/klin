from __future__ import annotations

from datetime import datetime
from typing import Optional, Sequence

from sqlmodel import Session, select

from app.adapters.sqlite.models.file_record import FileRecordORM


def create_file_record(
    session: Session,
    original_path: str,
    filename: str,
    file_hash: Optional[str] = None,
    category: Optional[str] = None,
) -> FileRecordORM:
    file_record = FileRecordORM(
        original_path=original_path,
        filename=filename,
        file_hash=file_hash,
        category=category,
    )
    session.add(file_record)
    session.commit()
    session.refresh(file_record)
    return file_record


def get_file_record(session: Session, file_id: int) -> Optional[FileRecordORM]:
    return session.get(FileRecordORM, file_id)


def get_file_by_hash(session: Session, file_hash: str) -> Optional[FileRecordORM]:
    statement = select(FileRecordORM).where(FileRecordORM.file_hash == file_hash)
    return session.exec(statement).first()


def get_file_by_path(session: Session, path: str) -> Optional[FileRecordORM]:
    statement = select(FileRecordORM).where(FileRecordORM.original_path == path)
    return session.exec(statement).first()


def get_files_by_category(session: Session, category: str) -> Sequence[FileRecordORM]:
    statement = select(FileRecordORM).where(FileRecordORM.category == category)
    return session.exec(statement).all()


def update_file_record(session: Session, file_id: int, **kwargs) -> Optional[FileRecordORM]:
    file_record = session.get(FileRecordORM, file_id)
    if file_record:
        for key, value in kwargs.items():
            if hasattr(file_record, key):
                setattr(file_record, key, value)
        file_record.updated_at = datetime.utcnow()
        session.add(file_record)
        session.commit()
        session.refresh(file_record)
    return file_record


def delete_file_record(session: Session, file_id: int) -> bool:
    file_record = session.get(FileRecordORM, file_id)
    if file_record:
        session.delete(file_record)
        session.commit()
        return True
    return False
