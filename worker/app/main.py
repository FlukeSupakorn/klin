from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi_voyager.server import create_voyager

from app.core.lifecycle import lifespan as original_lifespan
from app.api.v1.routers import health, organize, document
from app.api.dev_notes.routes import mount_dev_notes
from app.db import init_db
from app.core.exception_handlers import (
    validation_exception_handler,
    generic_exception_handler,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    try:
        init_db()
    except Exception as e:
        print(f"Failed to initialize database: {e}")

    # Run original lifespan
    async with original_lifespan(app):
        yield


app = FastAPI(
    title="FastAPI Worker - AI File Organizer",
    description="File processing worker with OCR, VLM analysis, and planning capabilities",
    version="0.3.0",
    lifespan=lifespan,
    exception_handlers={
        RequestValidationError: validation_exception_handler,
        Exception: generic_exception_handler,
    },
)

voyager_app = create_voyager(app)
app.mount("/voyager", voyager_app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Tauri or web frontends
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(organize.router)
app.include_router(document.router)
# app.include_router(plan.router)
# app.include_router(analyze.router)

# Mount dev-notes static files
mount_dev_notes(app)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=7071, reload=True)
