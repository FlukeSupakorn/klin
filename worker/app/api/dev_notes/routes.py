from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

# Get the worker directory (where docs folder is located)
WORKER_DIR = Path(__file__).resolve().parent.parent.parent.parent  # worker/


def mount_dev_notes(app: FastAPI):
    """Mount dev-notes with Docsify to the main app."""
    
    docs_dir = WORKER_DIR / "docs"
    
    # Serve Docsify (html=True serves index.html as default)
    if docs_dir.exists():
        app.mount("/notes", StaticFiles(directory=str(docs_dir), html=True), name="dev-notes")
