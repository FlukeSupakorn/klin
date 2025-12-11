# FastAPI Worker Demo [In Development]

A local FastAPI worker for processing files (PDF, DOCX, TXT) with VLM analysis, embedding, and planning logic capabilities.

## 📋 Prerequisites

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer
- **[Ollama](https://ollama.ai/)** - For VLM analysis

### Installing Ollama & VLM Model

**macOS/Linux:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull qwen3-vl:2b
```

**Verify Ollama is running:**
```bash
curl http://127.0.0.1:11434/api/tags
```

## 🛠️ Installation

1. **Install dependencies using uv**
```bash
uv sync
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Copy the `.env` file and adjust settings if needed (No need for basic usage):
```bash
PORT=7071
OLLAMA_BASE_URL=http://127.0.0.1:11434
MODEL_NAME=qwen3-vl:2b
HTTP_TIMEOUT=120
```

## 🏃 Running the Application

### Development Mode (with auto-reload)

**Option 1: Using FastAPI CLI (recommended)**
```bash
uv run fastapi dev app/main.py
```

**Option 2: Using Uvicorn directly**
```bash
uv run uvicorn app.main:app --reload
```

**Option 3: Using Python script (reads PORT from .env)**
```bash
uv run python app/main.py
```

### Comparison of Development Options

| Feature | FastAPI CLI | Uvicorn | Python Script |
|---------|-------------|---------|---------------|
| **Command** | `uv run fastapi dev app/main.py` | `uv run uvicorn app.main:app --reload` | `uv run python app/main.py` |
| **Default Port** | 8000 | 8000 | 7071 (from .env) |
| **Auto-reload** | ✅ Built-in | ✅ With `--reload` flag | ✅ Built-in |
| **Reads .env PORT** | ❌ | ❌ | ✅ |
| **Custom Port** | `--port 7071` | `--port 7071` | Edit `.env` file |
| **Best For** | Quick start, standard setup | Fine-grained control | Custom configuration |

### Production Mode
```bash
uv run fastapi run app/main.py
```

Or with uvicorn:
```bash
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The server will start at:
- **API**: http://127.0.0.1:8000
- **Interactive Docs**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **Voyager**: http://127.0.0.1:8000/voyager
- **Dev Notes**: http://127.0.0.1:8000/notes

## 📚 API Endpoints
> For Dev

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - returns `{"ok": true}` |
| `/voyager` | GET | API dependency visualization (FastAPI Voyager) |
| `/notes` | GET | Dev Notes documentation served with Docsify |

> For Application

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ingest` | POST | Process and parse PDF and TXT files |
| `/plan` | POST | Generate file organization suggestions |
| `/analyze` | POST | VLM analysis of images/PDFs (text extraction, description) |
| `/analyze` | GET | Get VLM endpoint information |

## 📁 Project Structure

```
worker/
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── adapters/        # External service integrations (Ollama, LLM)
│   ├── api/             # API routes and endpoints
│   │   ├── v1/          # Version 1 API routes
│   │   └── dev_notes/   # Dev Notes documentation routes
│   ├── core/            # Configuration and lifecycle management
│   ├── data/            # Data storage utilities
│   ├── db/              # Database integrations (JSON, LanceDB)
│   ├── schemas/         # Pydantic request/response models for validation
│   ├── services/        # Business logic (ingestion, planning, RAG)
│   └── utils/           # Utility functions
├── docs/                # Documentation (Docsify)
├── examples/            # Example scripts
├── prompt/              # AI prompt templates
├── pyproject.toml       # Project dependencies
└── uv.lock              # Dependency lock file
```

## 📄 Docsify
The documentation is served using [Docsify](https://docsify.js.org/). You can access it at the `/notes` endpoint when the server is running.

```bash
# install docsify-cli globally
npm i -g docsify-cli
```
```bash
# serve docs locally for preview
docsify serve ./docs
```

## 📝 License

MIT License

## 🤝 Contributing

We do not currently accept contributions to this project.