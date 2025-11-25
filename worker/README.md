# FastAPI Worker Demo [In Development]

A local FastAPI worker for processing files (PDF, DOCX, TXT) with VLM analysis, embedding, and planning logic capabilities.

## 🚀 Features

- **File Ingestion**: Parse and process PDF and TXT files
- **VLM Analysis**: Vision Language Model integration with Ollama for advanced image/document analysis
- **Planning Logic**: AI-driven file organization and classification simulation
- **Health Monitoring**: Simple health check endpoint
- **CORS Enabled**: Ready for Tauri desktop app or web frontend integration

## 📋 Prerequisites

- Python 3.13+
- [uv](https://github.com/astral-sh/uv) - Fast Python package installer
- **[Ollama](https://ollama.ai/)** - For VLM analysis

### Installing Ollama & VLM Model

**macOS/Linux:**
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the vision model (qwen3-vl:2b recommended for MacBook Air)
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

Copy the `.env` file and adjust settings if needed:
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

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check - returns `{"ok": true}` |
| `/voyager` | GET | API dependency visualization (FastAPI Voyager) |
| `/ingest` | POST | Process and parse PDF and TXT files |
| `/plan` | POST | Generate file organization suggestions |
| `/analyze` | POST | VLM analysis of images/PDFs (text extraction, description) |
| `/analyze` | GET | Get VLM endpoint information |

### Example: Ingest Files

```bash
curl -X POST "http://127.0.0.1:8000/ingest/" \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/path/to/document.pdf", "/path/to/file.txt"]
  }'
```

### Example: Get Plan

```bash
curl -X POST "http://127.0.0.1:8000/plan/" \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "demo"
  }'
```

### Example: Analyze Image/PDF with VLM

**Analyze an image:**
```bash
curl -X POST "http://127.0.0.1:8000/analyze/" \
  -F "file=@/path/to/photo_or_scan.jpg" \
  -F 'prompt=Extract text and summarize key fields.'
```

**Analyze a PDF document:**
```bash
curl -X POST "http://127.0.0.1:8000/analyze/" \
  -F "file=@/path/to/document.pdf" \
  -F "max_pages=2" \
  -F 'prompt=Extract text and return structured JSON fields: {title, date, total, items[]}.'
```

**Python client example:**
```python
import requests

with open("receipt.jpg", "rb") as f:
    resp = requests.post(
        "http://127.0.0.1:8000/analyze/",
        files={"file": ("receipt.jpg", f, "image/jpeg")},
        data={
            "prompt": "Extract text from the receipt and return JSON with {merchant, date, total, line_items[]}.",
            "max_pages": 1
        }
    )
print(resp.json())
```

## 📁 Project Structure

```
fastapi-worker/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py        # Health check endpoint
│   │   ├── ingest.py        # File ingestion endpoint
│   │   ├── plan.py          # Planning logic endpoint
│   │   └── analyze.py       # VLM analysis endpoint
│   └── services/
│       ├── __init__.py
│       ├── parser.py        # File parsing logic
│       └── vlm.py           # VLM/Ollama integration
├── prompt/
│   ├── init.md              # Setup instructions
│   └── init-2.md            # VLM setup guide
├── .env                     # Environment variables
├── .gitignore
├── pyproject.toml           # Project dependencies
├── uv.lock                  # Dependency lock file
└── README.md
```

## 🔧 Dependencies

- **fastapi[standard]** - Modern web framework (includes uvicorn, httpx, python-multipart)
- **pymupdf** - PDF processing and rendering
- **python-docx** - DOCX file support
- **openpyxl** - Excel file support
- **python-pptx** - PowerPoint file support
- **pillow** - Image processing and manipulation
- **chromadb** - Vector database for embeddings
- **pydantic-settings** - Settings management
- **requests** - HTTP client

## 🚀 Future Enhancements

- [x] VLM integration with Ollama for advanced image/document analysis
- [ ] Add `/summarize` endpoint for document summarization
- [ ] Add `/search` endpoint for RAG (Retrieval-Augmented Generation)
- [ ] Integrate Ollama embeddings for semantic search
- [ ] Support for DOCX, XLSX, and PPTX file formats in VLM
- [ ] Batch processing for multiple files
- [ ] Package as PyInstaller executable for Tauri sidecar
- [ ] Add authentication and rate limiting
- [ ] Add streaming responses for large documents

## 📝 License

MIT License

## 🤝 Contributing

We do not currently accept contributions to this project.