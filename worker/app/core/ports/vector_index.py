from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, Sequence


@dataclass(frozen=True)
class VectorRecord:
    id: str
    text: str
    embedding: Sequence[float]


@dataclass(frozen=True)
class VectorSearchResult:
    id: str
    score: float
    text: str | None = None


class VectorIndexPort(Protocol):
    def upsert(self, records: Sequence[VectorRecord]) -> None: ...

    def search(self, query_embedding: Sequence[float], k: int = 10) -> list[VectorSearchResult]: ...
