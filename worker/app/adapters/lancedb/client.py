from __future__ import annotations

from pathlib import Path

from lancedb import connect


def connect_lancedb(db_dir: Path):
    db_dir.mkdir(parents=True, exist_ok=True)
    return connect(str(db_dir))
