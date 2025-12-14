from __future__ import annotations

from typing import Optional, Sequence

from sqlmodel import Session, select

from app.adapters.sqlite.models.organize import OrganizeHistoryORM


def create_organize_history(
    session: Session,
    file_id: int,
    action_type: str,
    old_path: Optional[str] = None,
    new_path: Optional[str] = None,
    old_name: Optional[str] = None,
    new_name: Optional[str] = None,
    status: str = "success",
) -> OrganizeHistoryORM:
    history = OrganizeHistoryORM(
        file_id=file_id,
        action_type=action_type,
        old_path=old_path,
        new_path=new_path,
        old_name=old_name,
        new_name=new_name,
        status=status,
    )
    session.add(history)
    session.commit()
    session.refresh(history)
    return history


def get_history_for_file(session: Session, file_id: int) -> Sequence[OrganizeHistoryORM]:
    statement = (
        select(OrganizeHistoryORM)
        .where(OrganizeHistoryORM.file_id == file_id)
        .order_by(OrganizeHistoryORM.timestamp.desc())
    )
    return session.exec(statement).all()


def get_recent_history(session: Session, limit: int = 50) -> Sequence[OrganizeHistoryORM]:
    statement = (
        select(OrganizeHistoryORM)
        .order_by(OrganizeHistoryORM.timestamp.desc())
        .limit(limit)
    )
    return session.exec(statement).all()
