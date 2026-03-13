# Migration: LangChain + LanceDB → RAG-Anything

> **Date**: 2025  
> **Scope**: `worker/` FastAPI service  
> **Breaking**: Yes – API endpoints and storage backend changed

---

## Overview

The worker's document ingestion & retrieval pipeline has been migrated from
**LangChain + LanceDB** to **[RAG-Anything](https://github.com/HKUDS/RAG-Anything)**
(built on top of [LightRAG](https://github.com/HKUDS/LightRAG)).

### Why?

| Concern | Before | After |
|---------|--------|-------|
| LLM orchestration | LangChain chains, `RunnablePassthrough` | RAG-Anything + LightRAG (native) |
| Vector store | LanceDB (manual embeddings) | LightRAG's nano-vectordb (automatic) |
| Knowledge graph | ❌ | ✅ Entity/relation extraction built-in |
| Multimodal parsing | Manual OCR via `ollama_vlm.py` | MinerU parser (PDF/DOCX/images/tables/equations) |
| Retrieval modes | Vector similarity only | `naive`, `local`, `global`, `hybrid`, `mix` |
| Ollama integration | `langchain-ollama` wrapper | Native `ollama_model_complete` / `ollama_embed` |

---

## What Changed

### Dependencies (`pyproject.toml`)

**Removed:**
- `lancedb >= 0.25.3`
- `langchain-ollama >= 1.0.0`

**Added:**
- `raganything[all] >= 1.2.9`
- `lightrag-hku >= 1.3.6`
- `ollama >= 0.5.0`

### Files Modified

| File | Change |
|------|--------|
| `pyproject.toml` | Dependency swap, version → 0.2.0 |
| `app/core/config.py` | Added RAG-Anything & embedding settings |
| `app/services/embeddings.py` | Uses LightRAG `EmbeddingFunc` instead of `langchain_ollama` |
| `app/services/rag.py` | Complete rewrite — 4 async functions delegating to adapter |
| `app/schemas/document.py` | Expanded request/response models for multimodal |
| `app/api/v1/routers/document.py` | 5 new endpoints replacing old 2 |
| `app/core/container.py` | Removed `get_vector_index()` |
| `app/core/__init__.py` | Removed `get_vector_index` re-export |
| `app/core/ports/__init__.py` | Removed `VectorIndexPort` re-export |
| `app/db/manager.py` | Removed `LanceVectorIndex`, `vector_index` field |
| `app/db/__init__.py` | Removed `get_lancedb_dir()`, LanceDB dir creation |
| `app/core/lifecycle.py` | Initializes RAG-Anything adapter on startup |
| `.env.example` | New env vars documented |

### Files Created

| File | Purpose |
|------|---------|
| `app/adapters/ollama_lightrag.py` | LLM, VLM, and embedding functions for LightRAG |
| `app/adapters/raganything_adapter.py` | Singleton adapter wrapping `RAGAnything` |

### Files Now Dead Code (can be removed)

| File/Directory | Reason |
|----------------|--------|
| `app/adapters/lancedb/` | LanceDB no longer used |
| `app/core/ports/vector_index.py` | Port no longer wired |
| `app/services/hybrid_search.py` | Standalone LanceDB search script |
| `db/lancedb/` | LanceDB data directory |

---

## New API Endpoints

### `POST /api/v1/documents/ingest`
Ingest a document file (PDF, DOCX, image, etc.) via RAG-Anything's MinerU parser.

```json
{
  "file_path": "/path/to/document.pdf",
  "output_dir": "./output",
  "parse_method": "auto"
}
```

### `POST /api/v1/documents/ingest/content`
Ingest raw text content directly.

```json
{
  "content": "The quick brown fox...",
  "doc_id": "optional-id"
}
```

### `POST /api/v1/documents/search`
Query the knowledge base (text-only).

```json
{
  "query": "What are the main findings?",
  "mode": "hybrid",
  "vlm_enhanced": false
}
```

Modes: `naive`, `local`, `global`, `hybrid`, `mix`

### `POST /api/v1/documents/search/multimodal`
Query with multimodal context (images, tables).

```json
{
  "query": "Describe the chart in this document",
  "multimodal_content": [
    {"type": "image", "data": "<base64>", "description": "Revenue chart"}
  ],
  "mode": "hybrid"
}
```

### `GET /api/v1/documents/rag/info`
Returns RAG system configuration and status.

---

## Architecture

```
┌──────────────┐
│  FastAPI      │  ← document.py router
│  Endpoints    │
└──────┬───────┘
       │
┌──────▼───────┐
│  rag.py       │  ← thin async service layer
│  service      │
└──────┬───────┘
       │
┌──────▼──────────────────┐
│  raganything_adapter.py  │  ← singleton adapter
│  RAGAnythingAdapter      │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│  RAG-Anything            │  ← HKUDS library
│  ├─ MinerU parser        │     (document parsing)
│  ├─ LightRAG engine      │     (KG + vector retrieval)
│  │  ├─ nano-vectordb     │
│  │  ├─ knowledge graph   │
│  │  └─ KV stores         │
│  └─ ollama_lightrag.py   │  ← our Ollama glue
│     ├─ ollama_model_complete
│     ├─ ollama_embed
│     └─ ollama_vision_model_func
└─────────────────────────┘
       │
┌──────▼───────┐
│  Ollama       │  ← local inference
│  (qwen3-vl)  │
└──────────────┘
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EMBEDDING_MODEL` | `bge-m3:latest` | Ollama embedding model |
| `EMBEDDING_DIM` | `1024` | Embedding vector dimension |
| `RAG_WORKING_DIR` | `./rag_storage` | LightRAG internal storage |
| `RAG_PARSER` | `mineru` | Document parser (`mineru` or `docling`) |
| `RAG_PARSE_METHOD` | `auto` | Parse method (`auto`, `txt`, `ocr`) |
| `RAG_ENABLE_IMAGE_PROCESSING` | `true` | Process images in documents |
| `RAG_ENABLE_TABLE_PROCESSING` | `true` | Process tables in documents |
| `RAG_ENABLE_EQUATION_PROCESSING` | `true` | Process equations in documents |
| `RAG_OUTPUT_DIR` | `./output` | Parsed document output directory |

---

## Setup

```bash
cd worker/

# Install dependencies (including MinerU parser)
pip install -e ".[dev]"

# Pull required Ollama models
ollama pull qwen3-vl:2b
ollama pull bge-m3:latest

# Copy and edit environment
cp .env.example .env

# Run the server
uvicorn app.main:app --reload --port 8989
```

---

## Notes

- **Storage**: RAG-Anything manages its own storage in `RAG_WORKING_DIR`.
  No need to manually create vector tables. The directory contains:
  - `vdb_*` – nano-vectordb files
  - `graph_*.graphml` – knowledge graph
  - `kv_store_*.json` – key-value stores
  
- **SQLite** remains for relational data (file records, organize history, settings).

- **The organize flow** (`app/services/ingestion.py` → `ollama_vlm.py`) is unchanged.
  It still uses direct Ollama VLM calls for file classification/OCR. This is separate
  from the document RAG pipeline.

- **MinerU installation** may require additional system dependencies. See
  [MinerU docs](https://github.com/opendatalab/MinerU) for platform-specific setup.
