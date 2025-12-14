from __future__ import annotations

from typing import Optional

from sqlmodel import Session, select

from app.adapters.sqlite.models.embeddings import SummaryNoteORM


def create_summary_note(
    session: Session,
    file_id: int,
    summary: str,
    keywords: Optional[str] = None,
) -> SummaryNoteORM:
    note = SummaryNoteORM(file_id=file_id, summary=summary, keywords=keywords)
    session.add(note)
    session.commit()
    session.refresh(note)
    return note


def get_summary_for_file(session: Session, file_id: int) -> Optional[SummaryNoteORM]:
    statement = (
        select(SummaryNoteORM)
        .where(SummaryNoteORM.file_id == file_id)
        .order_by(SummaryNoteORM.created_at.desc())
    )
    return session.exec(statement).first()
