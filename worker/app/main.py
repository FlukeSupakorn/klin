import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health

app = FastAPI(
    title="FastAPI Worker Demo",
    description="File processing worker with OCR, VLM analysis, and planning capabilities",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow Tauri or web frontends
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
# app.include_router(ingest.router)
# app.include_router(plan.router)
# app.include_router(analyze.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "7071"))
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
