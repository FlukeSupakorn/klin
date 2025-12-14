from __future__ import annotations

from datetime import datetime
from typing import Optional, Sequence

from sqlmodel import Session, select

from app.adapters.sqlite.models.calendar import CalendarEventORM


def create_calendar_event(
    session: Session,
    file_id: int,
    title: str,
    event_date: datetime,
    description: Optional[str] = None,
) -> CalendarEventORM:
    event = CalendarEventORM(
        file_id=file_id,
        title=title,
        event_date=event_date,
        description=description,
    )
    session.add(event)
    session.commit()
    session.refresh(event)
    return event


def get_events_for_file(session: Session, file_id: int) -> Sequence[CalendarEventORM]:
    statement = select(CalendarEventORM).where(CalendarEventORM.file_id == file_id)
    return session.exec(statement).all()


def get_events_in_range(
    session: Session,
    start_date: datetime,
    end_date: datetime,
) -> Sequence[CalendarEventORM]:
    statement = (
        select(CalendarEventORM)
        .where(CalendarEventORM.event_date >= start_date)
        .where(CalendarEventORM.event_date <= end_date)
        .order_by(CalendarEventORM.event_date)
    )
    return session.exec(statement).all()
