from __future__ import annotations

from typing import Optional, Sequence

from sqlmodel import Session, select

from app.adapters.sqlite.models.organize import DuplicateRecordORM, OrganizePlanORM


def create_organize_plan(
    session: Session,
    file_id: int,
    action_type: str,
    suggested_path: Optional[str] = None,
    suggested_name: Optional[str] = None,
    reason: Optional[str] = None,
) -> OrganizePlanORM:
    plan = OrganizePlanORM(
        file_id=file_id,
        action_type=action_type,
        suggested_path=suggested_path,
        suggested_name=suggested_name,
        reason=reason,
    )
    session.add(plan)
    session.commit()
    session.refresh(plan)
    return plan


def get_plans_for_file(session: Session, file_id: int) -> Sequence[OrganizePlanORM]:
    statement = select(OrganizePlanORM).where(OrganizePlanORM.file_id == file_id)
    return session.exec(statement).all()


def create_duplicate_record(
    session: Session,
    file_id: int,
    duplicate_of: int,
    similarity_score: float = 1.0,
) -> DuplicateRecordORM:
    duplicate = DuplicateRecordORM(
        file_id=file_id,
        duplicate_of=duplicate_of,
        similarity_score=similarity_score,
    )
    session.add(duplicate)
    session.commit()
    session.refresh(duplicate)
    return duplicate


def get_duplicates_of(session: Session, original_file_id: int) -> Sequence[DuplicateRecordORM]:
    statement = select(DuplicateRecordORM).where(DuplicateRecordORM.duplicate_of == original_file_id)
    return session.exec(statement).all()
