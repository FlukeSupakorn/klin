from __future__ import annotations

from pathlib import Path

from alembic import command
from alembic.config import Config


def _alembic_config() -> Config:
    repo_root = Path(__file__).resolve().parents[4]  # worker/
    ini_path = repo_root / "app" / "adapters" / "sqlite" / "migrations" / "alembic.ini"
    cfg = Config(str(ini_path))
    cfg.set_main_option("script_location", "app/adapters/sqlite/migrations")
    return cfg


def upgrade_head() -> None:
    command.upgrade(_alembic_config(), "head")
