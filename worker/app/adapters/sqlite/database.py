"""SQLite database connection and session management (adapter-owned).

This module is the single source of truth for:
- SQLite file location
- SQLModel engine
- startup initialization (Alembic migrations preferred)
"""

from __future__ import annotations

from pathlib import Path
from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

# Database configuration
# Runtime storage lives under `worker/db/` (NOT inside the `app/` package).
WORKER_DIR = Path(__file__).resolve().parents[3]  # worker/
DB_DIR = WORKER_DIR / "db" / "sqlite"
DB_FILE = DB_DIR / "organizer.db"

# Create database URL
DATABASE_URL = f"sqlite:///{DB_FILE}"

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    connect_args={"check_same_thread": False},  # Needed for SQLite with FastAPI
)


def init_db() -> None:
    """Initialize SQLite: run Alembic migrations if available, else create tables."""
    DB_DIR.mkdir(parents=True, exist_ok=True)

    # Ensure ORM models are imported and registered with SQLModel.metadata
    from app.adapters.sqlite import models as _models  # noqa: F401

    # Prefer Alembic migrations if available; fallback to create_all.
    try:
        from app.adapters.sqlite.migrations import upgrade_head

        upgrade_head()
        print(f"SQLite migrations applied at: {DB_FILE}")
    except Exception:
        SQLModel.metadata.create_all(engine)
        print(f"SQLite database initialized at: {DB_FILE}")


def get_session() -> Generator[Session, None, None]:
    """Yield a SQLModel session."""
    with Session(engine) as session:
        yield session
