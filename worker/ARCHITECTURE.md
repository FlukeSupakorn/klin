# Worker — Architecture & Workflow Guide

> **Purpose**: FastAPI backend that processes files with AI-powered OCR / VLM,
> organises them into destination folders, and provides a RAG knowledge-base
> for document search.  The worker **never** moves files — it returns *plans*;
> the Tauri frontend executes the actual file operations.

---

## 1. Quick Start

```bash
cd worker
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"          # or: uv sync
uvicorn app.main:app --reload    # http://127.0.0.1:7071
```

Environment variables (or `.env`):

| Variable | Default | Description |
|---|---|---|
| `OLLAMA_BASE_URL` | `http://127.0.0.1:11434` | Ollama server |
| `MODEL_NAME` | `qwen3-vl:2b` | VLM model for OCR + reasoning |
| `EMBEDDING_MODEL` | `bge-m3:latest` | Embedding model (1024 dim) |
| `RAG_WORKING_DIR` | `./rag_storage` | LightRAG storage directory |
| `RAG_PARSER` | `mineru` | Document parser (`mineru` / `docling`) |
| `MAX_FILE_SIZE_MB` | `50` | Max file size for ingestion |
| `LOG_LEVEL` | `INFO` | `DEBUG`, `INFO`, `WARNING`, etc. |
| `LOG_FORMAT` | `json` | `json` or `text` |

Full list → `app/core/config.py` (`Settings` class).

---

## 2. File Tree

```
worker/
├── app/
│   ├── main.py                          ← FastAPI app entry point
│   │
│   ├── api/                             ← HTTP layer (routers)
│   │   ├── v1/routers/
│   │   │   ├── health.py                   GET  /v1/health
│   │   │   ├── organize.py                 POST /v1/organize
│   │   │   └── document.py                 POST /documents/ingest
│   │   │                                   POST /documents/ingest/content
│   │   │                                   POST /documents/search
│   │   │                                   POST /documents/search/multimodal
│   │   │                                   GET  /documents/rag/info
│   │   └── dev_notes/routes.py          ← serves Docsify docs at /notes
│   │
│   ├── schemas/                         ← Pydantic request / response models
│   │   ├── common.py                       FilePath, Destination, PlanAction,
│   │   │                                   ItemResult, Envelope
│   │   ├── organize.py                     OrganizeOptions, OrganizeRequest,
│   │   │                                   OrganizeResponse
│   │   └── document.py                     DocumentIngestRequest, SearchRequest,
│   │                                       SearchResponse, etc.
│   │
│   ├── services/                        ← Business logic (no HTTP concerns)
│   │   ├── ingestion.py                    IngestOptions, IngestionResult,
│   │   │                                   process_single_file, process_files
│   │   ├── planning.py                     generate_plan_for_file, organize_files
│   │   └── rag.py                          ingest_document, ingest_content,
│   │                                       query_rag, query_rag_multimodal
│   │
│   ├── adapters/                        ← External integrations
│   │   ├── ollama_vlm.py                   Ollama VLM OCR (base64 → text)
│   │   ├── ollama_lightrag.py              LLM / VLM / embedding funcs for
│   │   │                                   LightRAG (used by RAG-Anything)
│   │   ├── raganything_adapter.py          RAG-Anything singleton wrapper
│   │   └── sqlite/                         SQLite persistence (SQLModel)
│   │       ├── database.py                    engine, init_db()
│   │       ├── session.py                     session_scope()
│   │       ├── models/file_record.py          FileRecordORM table
│   │       ├── crud/file_crud.py              CRUD helpers
│   │       ├── repos/file_repo_sqlite.py      SqliteFileRepository (implements port)
│   │       └── mappers.py                     FileRecord dataclass + ORM↔domain mapper
│   │
│   ├── core/                            ← Framework plumbing
│   │   ├── config.py                       Settings (pydantic-settings)
│   │   ├── container.py                    get_file_repo() for FastAPI Depends()
│   │   ├── lifecycle.py                    startup / shutdown (Ollama check, RAG init)
│   │   ├── logging.py                      JSON structured logging
│   │   ├── exception_handlers.py           global 422 / 500 handlers
│   │   └── ports/file_repo.py              FileRepositoryPort (Protocol)
│   │
│   ├── db/__init__.py                   ← init_db() thin wrapper
│   ├── utils/__init__.py                ← calculate_sha256, is_allowed_extension,
│   │                                       get_file_size_mb
│   └── __init__.py
│
├── db/sqlite/organizer.db               ← runtime SQLite database
├── docs/                                ← Docsify dev notes (served at /notes)
├── tests/
└── pyproject.toml
```

---

## 3. Workflows & Data Flow

### 3.1 Organize (VLM OCR → planning)

```
Tauri frontend
  │
  ▼  POST /v1/organize { files, destinations, options }
┌─────────────────────────────────────────────────────┐
│ organize.py router                                  │
│   → planning.organize_files(paths, dests, opts)     │
│       ┌────────────────────────────────────────┐    │
│       │ For each file:                         │    │
│       │  1. ingestion.process_single_file()    │    │
│       │     • validate size / extension        │    │
│       │     • sha256 hash                      │    │
│       │     • duplicate check (file_repo)      │    │
│       │     • ollama_vlm.extract_text_with_llm │    │
│       │       ─► Ollama /api/generate          │    │
│       │          (base64 file → extracted text) │    │
│       │                                        │    │
│       │  2. Build PlanAction                   │    │
│       │     { move, rename, duplicate_of,      │    │
│       │       summary, confidence, reason }    │    │
│       │     (TODO: LLM-based reasoning)        │    │
│       └────────────────────────────────────────┘    │
│   ← OrganizeResponse { request_id, results[] }      │
└─────────────────────────────────────────────────────┘
```

**Libraries used**: `httpx` (Ollama HTTP), `pydantic` (schemas), `sqlmodel` (duplicate check).

### 3.2 Document RAG (ingest + search)

```
                     ┌────────────────────────────────────┐
                     │     RAG-Anything + LightRAG        │
POST /documents/     │                                    │
  ingest ───────────►│  raganything_adapter.ingest_document│
                     │    • MinerU/Docling parses file     │
                     │    • extracts text, images, tables  │
                     │    • builds knowledge graph         │
                     │    • indexes into nano-vectorDB     │
                     │                                    │
POST /documents/     │                                    │
  ingest/content ───►│  raganything_adapter                │
                     │    .ingest_content_list             │
                     │    (pre-extracted text, no parsing) │
                     │                                    │
POST /documents/     │                                    │
  search ───────────►│  raganything_adapter.query          │
                     │    • hybrid retrieval (graph+vector)│
                     │    • LLM generates grounded answer  │
                     │    ← answer string                  │
                     └────────────────────────────────────┘
```

**Libraries used**: `raganything` (multimodal RAG), `lightrag-hku` (knowledge graph + vector),
`ollama` (LLM/embedding), `numpy` (embeddings).

### 3.3 Startup sequence

```
main.py lifespan()
  1. init_db()  →  SQLite tables via Alembic (or create_all fallback)
  2. lifecycle.lifespan()
     a. setup_logging()
     b. check Ollama connectivity  (GET /api/tags)
     c. pre-create RAG-Anything adapter (lazy singleton)
  3. yield  (app serves requests)
  4. shutdown log
```

---

## 4. Key Abstractions

| Concept | Location | Description |
|---|---|---|
| **Settings** | `core/config.py` | All env vars, `@lru_cache` singleton |
| **FileRepositoryPort** | `core/ports/file_repo.py` | Protocol for file persistence |
| **SqliteFileRepository** | `adapters/sqlite/repos/file_repo_sqlite.py` | Port implementation |
| **get_file_repo()** | `core/container.py` | `Depends()` getter, `@lru_cache` singleton |
| **RAGAnythingAdapter** | `adapters/raganything_adapter.py` | Wraps RAG-Anything, module-level singleton |
| **IngestOptions** | `services/ingestion.py` | Controls OCR, size limit, folder traversal |
| **IngestionResult** | `services/ingestion.py` | Result of single-file text extraction |

---

## 5. Adding a New Feature (step-by-step)

1. **Schema** — add request/response models in `app/schemas/`.
2. **Service** — add business logic in `app/services/`.
3. **Router** — add an endpoint in `app/api/v1/routers/`, register it in `main.py`.
4. **Adapter** (if external) — add in `app/adapters/`, expose via port if needed.
5. **Test** — add in `tests/api/v1/`.

---

## 6. External Dependencies

| Library | Version | Used For |
|---|---|---|
| **FastAPI** | ≥ 0.121 | Web framework |
| **Pydantic / pydantic-settings** | v2 | Schemas, config |
| **SQLModel** | ≥ 0.0.24 | ORM (SQLite) |
| **Alembic** | ≥ 1.14 | DB migrations |
| **RAG-Anything** | ≥ 1.2.9 | Multimodal RAG pipeline |
| **LightRAG** | ≥ 1.3.6 | Knowledge-graph + vector retrieval |
| **Ollama** (python) | ≥ 0.5 | LLM / VLM / embedding client |
| **httpx** | ≥ 0.28 | Async HTTP (Ollama REST) |
| **numpy** | ≥ 2.3 | Embedding arrays |

---

## 7. Removed (historical)

The following were removed during the RAG-Anything migration & cleanup:

- **LangChain** / `langchain-ollama` — replaced by direct Ollama + LightRAG
- **LanceDB** / vector-index adapter — replaced by RAG-Anything's built-in storage
- **Domain layer** (`core/domain/`) — over-abstracted; `FileRecord` now lives in `mappers.py`
- **DatabaseManager** — replaced by simple `@lru_cache` singleton in `container.py`
- **History / Settings repos** — unused CRUD + ports removed
- **Calendar / Embeddings / Organize ORM models** — unused tables removed
- **`call_llm.py`** — legacy LangChain adapter replaced by `ollama_vlm.py`
