import os
from pathlib import Path
from contextlib import asynccontextmanager

import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_voyager.server import create_voyager
from lancedb import connect

from app.core.lifecycle import lifespan as original_lifespan
from app.api.v1.routers import health, organize

# Setup DB path
BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "db" / "lancedb"

def make_sample_df(n=256, dim=128):
    rng = np.random.default_rng(42)
    embeddings = [rng.random(dim).astype(np.float32).tolist() for _ in range(n)]
    df = pd.DataFrame({
        "id": list(range(n)),
        "text": [f"item {i}" for i in range(n)],
        "embedding": embeddings,
    })
    return df

def init_db():
    DB_DIR.mkdir(exist_ok=True)
    print(f"Connecting to LanceDB at: {DB_DIR}")
    db = connect(str(DB_DIR))

    # Table name
    table_name = "Files"
    # Make sample data
    df = make_sample_df(n=256, dim=128)

    # Create Table in DB
    # TODO: When finished testing add exist_ok=True
    table = db.create_table(name=table_name, data=df, mode="overwrite")
    print(f"Created table '{table_name}' with {len(df)} rows.")

    # Optional: try to create an index on `embedding`
    try:
        print("Creating index on 'embedding' column...")
        # Cosine is best metic for us, it ues IVF + PQ
        table.create_index(metric="cosine", vector_column_name="embedding", num_partitions=8)
        print("Index created")
    except Exception as e:
        print("Index creation skipped or unsupported in this lancedb version:", e)

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
    lifespan=lifespan
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
# app.include_router(plan.router)
# app.include_router(analyze.router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "7071"))
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=True)
