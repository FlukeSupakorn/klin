# FastAPI Worker Summary

## Purpose

The worker provides a FastAPI-based backend for the AI File Organizer. It acts as the orchestration layer that ingests local files, extracts rich text using a multimodal LLM, and produces structured organization plans for the desktop or web front-end (for example the Tauri client). The worker **never moves or mutates files** itself—it only returns actionable plans and metadata that the client can execute.

## Runtime Stack

- **Framework**: [`FastAPI`](https://fastapi.tiangolo.com/) application defined in `app/main.py`
- **Server**: Runs with Uvicorn (see `if __name__ == "__main__":` block in `app/main.py`)
- **Configuration**: Environment-driven settings via `app.core.config.Settings`
- **Logging**: Structured JSON/text logging with `app.core.logging`
- **LLM adapter**: Ollama multimodal extraction through `app.adapters.ollama_vlm`

## Startup & Lifecycle

- Lifespan context (`app.core.lifecycle.lifespan`) configures logging and validates the Ollama endpoint on startup.
- Settings are provided by `app.core.config.get_settings()`, covering ports, model selection, max file size, and allowed extensions.
- Structured logs emit `request_id` breadcrumbs for traceability during request handling.

## Public API Surface

| Route | Method | Description | Implementation | Response |
| --- | --- | --- | --- | --- |
| `/v1/health` | GET | Health probe used by platform supervisors and orchestration. | `app.api.v1.routers.health.health` | `{"ok": true}` |
| `/v1/organize` | POST | Generates per-file organization plans (move/rename/summarize). | `app.api.v1.routers.organize.organize` | `app.schemas.organize.OrganizeResponse` |

### Schemas

Public requests and responses are defined under `app.schemas`:

- `app.schemas.common`: Core data models (`FilePath`, `Destination`, `PlanAction`, `ItemResult`, `Envelope`).
- `app.schemas.organize`: `OrganizeRequest`, `OrganizeOptions`, `OrganizeResponse`.
- `app.schemas.ingest`: Shared ingestion interfaces used internally by services.

## Organize Pipeline (Call Chain)

1. **API entrypoint** – `organize()` (`app.api.v1.routers.organize`) validates the payload and logs a scoped `request_id`.
2. **Planner service** – `organize_files()` (`app.services.planning`) iterates over files and delegates work per file.
3. **Per-file planning** – `generate_plan_for_file()` (`app.services.planning`) orchestrates ingestion, applies heuristics/LLM output, and builds an `ItemResult`.
4. **Ingestion layer** – `process_single_file()` (`app.services.ingestion`) guards file size/extensions, produces SHA-256 hashes, and calls the LLM adapter.
5. **LLM adapter** – `extract_text_with_llm()` (`app.adapters.ollama_vlm`) streams the base64 payload to Ollama, returning extracted text and metadata.
6. **Utilities** – Helpers in `app.utils` (hashing, extension allow-list checks, size calculations) support ingestion safeguards.

The resulting `ItemResult` objects are packaged into an `OrganizeResponse` envelope that the front-end consumes to execute real file operations.

## Extensibility Notes

- Additional routers can be registered in `app/main.py`. Commented stubs (`plan`, `analyze`) hint at upcoming features.
- Replace heuristic planning in `generate_plan_for_file()` with richer LLM reasoning when available.
- Extend `OrganizeOptions` to surface new behaviors (e.g., duplicate detection thresholds, summary styles).
- Adapter design allows swapping Ollama for other OCR/LLM vendors by implementing the same interface as `extract_text_with_llm()`.

## Related Documentation

- `worker/docs/API_EXAMPLES.md` – Sample payloads for using the worker endpoints.
- `worker/docs/ARCHITECTURE_COMPARISON.md` – High-level architecture trade-offs between orchestrator options.
- `worker/docs/README_REFACTORING.md` – Notes on refactoring roadmap for the worker codebase.
