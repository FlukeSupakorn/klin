from __future__ import annotations

from contextlib import contextmanager
from collections.abc import Iterator

from sqlmodel import Session

from app.adapters.sqlite.database import engine


@contextmanager
def session_scope() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
