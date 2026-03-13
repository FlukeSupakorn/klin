"""Database initialization."""

from app.adapters.sqlite.database import init_db as _init_sqlite


def init_db() -> None:
    """Initialize SQLite tables on startup."""
    _init_sqlite()


