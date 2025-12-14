from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from app.adapters.lancedb.client import connect_lancedb
from app.core.ports.vector_index import VectorIndexPort, VectorRecord, VectorSearchResult


class LanceVectorIndex(VectorIndexPort):
    def __init__(self, db_dir: Path, table_name: str = "Files"):
        self._db_dir = db_dir
        self._table_name = table_name

    def _db(self):
        return connect_lancedb(self._db_dir)

    def _open_or_create_table(self):
        db = self._db()
        try:
            table_names = set(db.table_names()) if hasattr(db, "table_names") else set()
        except Exception:
            table_names = set()

        if self._table_name in table_names:
            return db.open_table(self._table_name)

        # Create with empty dataframe; LanceDB will infer schema.
        df = pd.DataFrame({"id": [], "text": [], "embedding": []})
        return db.create_table(self._table_name, data=df, mode="overwrite")

    def upsert(self, records: list[VectorRecord] | tuple[VectorRecord, ...] | Any) -> None:
        table = self._open_or_create_table()
        df = pd.DataFrame(
            {
                "id": [r.id for r in records],
                "text": [r.text for r in records],
                "embedding": [list(map(float, r.embedding)) for r in records],
            }
        )
        # LanceDB supports add/append; "add" is most common.
        if hasattr(table, "add"):
            table.add(df)
        else:
            table.insert(df)

    def search(self, query_embedding, k: int = 10) -> list[VectorSearchResult]:
        table = self._open_or_create_table()
        q = list(map(float, query_embedding))

        # Common search API
        if hasattr(table, "search"):
            res = table.search(q).limit(k)
            if hasattr(res, "to_pandas"):
                pdf = res.to_pandas()
            else:
                pdf = pd.DataFrame(list(res))
        else:
            raise RuntimeError("This LanceDB table does not support search()")

        out: list[VectorSearchResult] = []
        for _, row in pdf.iterrows():
            score = float(row.get("_distance", row.get("score", 0.0)))
            out.append(
                VectorSearchResult(
                    id=str(row.get("id")),
                    score=score,
                    text=(str(row.get("text")) if "text" in row else None),
                )
            )
        return out
