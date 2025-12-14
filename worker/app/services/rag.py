from pathlib import Path
import sys
import base64
import hashlib
import pandas as pd
import numpy as np

try:
    from lancedb import connect
except Exception:
    print("lancedb is not installed. Install with: pip install lancedb")
    raise


def file_to_base64(path: Path) -> tuple[str, bytes]:
    b = path.read_bytes()
    return base64.b64encode(b).decode("utf-8"), b


def bytes_to_deterministic_vector(b: bytes, dim: int = 64) -> list:
    # Use SHA512 to produce enough bytes for a deterministic vector
    digest = hashlib.sha512(b).digest()
    out = bytearray()
    cur = digest
    while len(out) < dim:
        out.extend(cur)
        cur = hashlib.sha512(cur).digest()
    arr = np.frombuffer(bytes(out[:dim]), dtype=np.uint8).astype(np.float32) / 255.0
    return arr.tolist()


def text_to_embedding(text: str, dim: int) -> list:
    """Try to create a semantic embedding using sentence-transformers.
    If unavailable, fall back to deterministic hash-based embedding.
    """
    try:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")
        vec = model.encode([text])[0]
        vec = np.array(vec, dtype=np.float32)
        if vec.size != dim:
            if vec.size > dim:
                vec = vec[:dim]
            else:
                out = np.zeros(dim, dtype=np.float32)
                out[: vec.size] = vec
                vec = out
        return vec.tolist()
    except Exception:
        return bytes_to_deterministic_vector(text.encode("utf-8"), dim=dim)


def extract_text_from_pdf(path: Path) -> str | None:
    try:
        import PyPDF2

        with path.open("rb") as f:
            reader = PyPDF2.PdfReader(f)
            pages = []
            for p in reader.pages:
                try:
                    pages.append(p.extract_text() or "")
                except Exception:
                    pages.append("")
            text = "\n".join(pages)
            return text.strip() or None
    except Exception:
        return None


def find_db_dir(script_dir: Path) -> Path:
    # search upwards for lancedb_store (works with repo layout)
    for parent in (script_dir, *script_dir.parents):
        cand = parent / "lancedb_store"
        if cand.exists():
            return cand
    # fallback to script sibling
    cand = script_dir / "lancedb_store"
    return cand


def find_data_dir(script_dir: Path) -> Path:
    # Search upward for a `data` folder (common in this repo layout)
    for parent in (script_dir, *script_dir.parents):
        cand = parent / "data"
        if cand.exists():
            return cand
    # fallback to two levels up + data (best-effort)
    return script_dir.parent.parent / "data"


def load_request_config(script_dir: Path) -> list[str]:
    # Look for request.json in worker/db/jsondb/request.json
    worker_dir = script_dir.parent.parent  # worker/
    req_path = worker_dir / "db" / "jsondb" / "request.json"
    if not req_path.exists():
        print(f"Config file not found: {req_path}")
        return []
    
    try:
        import json
        with req_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("destination", [])
    except Exception as e:
        print(f"Failed to load config: {e}")
        return []

#TODO : not finished yet (turn into a function)
def main():
    script_dir = Path(__file__).resolve().parent
    
    destinations = load_request_config(script_dir)
    if not destinations:
        print("No destinations found in request.json")
        sys.exit(1)

    all_files = []
    for dest in destinations:
        path = Path(dest)
        if not path.exists():
            print(f"Path does not exist: {path}")
            continue
            
        if path.is_file():
             if path.suffix.lower() in (".txt", ".md", ".text", ".pdf"):
                 all_files.append(path)
        elif path.is_dir():
            # Recursively find supported files
            for ext in ("*.txt", "*.md", "*.text", "*.pdf"):
                all_files.extend(path.rglob(ext))
    
    if not all_files:
        print("No valid files found to ingest.")
        sys.exit(0)
        
    print(f"Found {len(all_files)} files to ingest.")

    # Determine DB directory
    db_dir = find_db_dir(script_dir)
    db_dir.mkdir(parents=True, exist_ok=True)

    print(f"Connecting to LanceDB at: {db_dir}")
    db = connect(str(db_dir))

    table_name = "Files"

    # If table exists, read it to determine next id and embedding dim
    existing = None
    try:
        tab = db.table(table_name)
        try:
            existing = tab.to_pandas()
        except Exception:
            try:
                existing = pd.DataFrame(list(tab))
            except Exception:
                existing = None
    except Exception:
        existing = None
    
    if existing is not None:
        pass

    next_id = 0
    target_dim = 64
    if existing is not None and not existing.empty:
        if "id" in existing.columns:
            try:
                next_id = int(existing["id"].max()) + 1
            except Exception:
                next_id = len(existing)
        else:
            next_id = len(existing)

        if "embedding" in existing.columns:
            first = existing["embedding"].iloc[0]
            try:
                target_dim = len(first)
            except Exception:
                target_dim = 64

    rows = []
    for i, arg_path in enumerate(all_files):
        print(f"Processing [{i+1}/{len(all_files)}]: {arg_path.name}")
        try:
            b64, raw_bytes = file_to_base64(arg_path)

            suffix = arg_path.suffix.lower()
            text_field = None

            if suffix in (".txt", ".md", ".text"):
                try:
                    text_field = arg_path.read_text(encoding="utf-8")
                except Exception:
                    text_field = None
            elif suffix == ".pdf":
                text_field = extract_text_from_pdf(arg_path)

            # Compute embedding
            if text_field:
                embedding = text_to_embedding(text_field, dim=target_dim)
            else:
                embedding = bytes_to_deterministic_vector(raw_bytes, dim=target_dim)

            row = {
                "id": next_id + i,
                "filename": arg_path.name,
                "content_base64": b64,
                "embedding": embedding,
            }
            if text_field:
                row["text"] = text_field
            
            rows.append(row)
        except Exception as e:
            print(f"Error processing {arg_path}: {e}")

    if not rows:
        print("No rows generated.")
        sys.exit(0)

    df = pd.DataFrame(rows)

    # Upsert: use add() to append if table exists, otherwise create
    try:
        try:
            tbl = db.open_table(table_name)
            tbl.add(df)
            table = tbl
            print(f"Appended {len(rows)} rows to '{table_name}'.")
        except Exception:
            # Table doesn't exist or cannot be opened
            table = db.create_table(table_name, df)
            print(f"Created table '{table_name}' with {len(rows)} rows.")
    except Exception as e:
        print("Failed to write table:", e)
        sys.exit(1)

    # Print a short preview
    try:
        preview = table.to_pandas()[["id", "filename"]]
        print("Preview (last 5):")
        print(preview.tail(5))
    except Exception:
        try:
            print(list(table.select(limit=5)))
        except Exception:
            print("Stored records. Inspect using the lancedb client APIs.")


if __name__ == "__main__":
    main()
