from pathlib import Path
import argparse
import re
import sys
import math
import hashlib

import numpy as np
import pandas as pd

try:
    from lancedb import connect
except Exception:
    print("lancedb is not installed. Install with: pip install lancedb")
    raise


def find_db_dir(script_dir: Path) -> Path:
    for parent in (script_dir, *script_dir.parents):
        cand = parent / "lancedb_store"
        if cand.exists():
            return cand

    # Common fallback: check current working directory
    cwd_cand = Path.cwd() / "lancedb_store"
    if cwd_cand.exists():
        return cwd_cand

    return cwd_cand


def load_table(db, table_name: str, db_dir: Path | None = None) -> pd.DataFrame:
    last_exc = None
    # Try common client methods
    for method in ("table", "open_table", "get_table"):
        if hasattr(db, method):
            try:
                t = getattr(db, method)(table_name)
                # If method returned a DataFrame directly
                if isinstance(t, pd.DataFrame):
                    return t
                # Try to call to_pandas()
                if hasattr(t, "to_pandas"):
                    return t.to_pandas()
                # Try to convert an iterable
                try:
                    return pd.DataFrame(list(t))
                except Exception:
                    pass
            except Exception as e:
                last_exc = e

    # If above failed, try to locate a .lance table file and connect to it directly
    if db_dir is not None:
        table_path = Path(db_dir) / f"{table_name}.lance"
        if table_path.exists():
            try:
                db2 = connect(str(table_path))
                # Some LanceDB variants expose table contents directly
                if hasattr(db2, "to_pandas"):
                    return db2.to_pandas()
                if hasattr(db2, "table"):
                    t2 = db2.table(table_name)
                    if hasattr(t2, "to_pandas"):
                        return t2.to_pandas()
                    try:
                        return pd.DataFrame(list(t2))
                    except Exception:
                        pass
            except Exception as e:
                last_exc = e

    raise RuntimeError(f"Failed to load table '{table_name}': {last_exc}")


def get_embedding_dim(df: pd.DataFrame, col: str = "embedding") -> int:
    if col not in df.columns:
        raise KeyError(f"Embedding column '{col}' not in table")
    first = df[col].iloc[0]
    return len(first)


def text_to_vector_with_fallback(text: str, dim: int) -> np.ndarray:
    # Try sentence-transformers if available
    try:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer("all-MiniLM-L6-v2")
        vec = model.encode([text])[0]
        vec = np.array(vec, dtype=np.float32)
        if vec.size != dim:
            # project/truncate/pad deterministically
            if vec.size > dim:
                return vec[:dim]
            else:
                out = np.zeros(dim, dtype=np.float32)
                out[: vec.size] = vec
                return out
        return vec
    except Exception:
        # deterministic hash-based vector
        digest = hashlib.sha512(text.encode("utf-8")).digest()
        out = bytearray()
        cur = digest
        while len(out) < dim:
            out.extend(cur)
            cur = hashlib.sha512(cur).digest()
        arr = np.frombuffer(bytes(out[:dim]), dtype=np.uint8).astype(np.float32) / 255.0
        return arr


def cosine_similarity_matrix(query_vec: np.ndarray, emb_matrix: np.ndarray) -> np.ndarray:
    # emb_matrix shape (n, dim)
    q = query_vec.astype(np.float32)
    denom_q = np.linalg.norm(q)
    denom_e = np.linalg.norm(emb_matrix, axis=1)
    # avoid division by zero
    denom = denom_q * denom_e
    dots = emb_matrix.dot(q)
    sim = np.zeros_like(dots, dtype=np.float32)
    nonzero = denom > 0
    sim[nonzero] = dots[nonzero] / denom[nonzero]
    return sim


def lexical_score(query: str, texts: pd.Series) -> np.ndarray:
    # simple Jaccard token overlap between query tokens and document tokens
    q_tokens = set(re.findall(r"\w+", query.lower()))
    scores = []
    for t in texts.fillna(""):
        t_tokens = set(re.findall(r"\w+", str(t).lower()))
        if not q_tokens and not t_tokens:
            scores.append(0.0)
            continue
        inter = q_tokens.intersection(t_tokens)
        union = q_tokens.union(t_tokens)
        score = len(inter) / len(union) if union else 0.0
        scores.append(score)
    return np.array(scores, dtype=np.float32)


def hybrid_search(df: pd.DataFrame, query: str, k: int = 5, alpha: float = 0.7) -> pd.DataFrame:
    emb_col = "embedding"
    dim = get_embedding_dim(df, emb_col)
    # Build embedding matrix
    emb_matrix = np.stack(df[emb_col].to_numpy()).astype(np.float32)

    q_vec = text_to_vector_with_fallback(query, dim)
    vec_scores = cosine_similarity_matrix(q_vec, emb_matrix)

    # Choose a textual field to compute lexical similarity. Prefer `text`, then `filename`.
    if "text" in df.columns:
        text_series = df["text"].astype(str)
    elif "filename" in df.columns:
        text_series = df["filename"].astype(str)
    else:
        # fallback to stringified row
        text_series = df.apply(lambda r: " ".join([str(x) for x in r.values]), axis=1)

    lex_scores = lexical_score(query, text_series)

    # Normalize both scores to [0,1]
    def normalize(a: np.ndarray) -> np.ndarray:
        if a.max() == a.min():
            return np.zeros_like(a)
        a2 = (a - a.min()) / (a.max() - a.min())
        return a2

    vec_norm = normalize(vec_scores)
    lex_norm = normalize(lex_scores)

    combined = alpha * vec_norm + (1.0 - alpha) * lex_norm

    df_out = df.copy()
    df_out["vector_score"] = vec_scores
    df_out["lexical_score"] = lex_scores
    df_out["score"] = combined

    return df_out.sort_values("score", ascending=False).head(k)


def main():
    # parser = argparse.ArgumentParser()
    # parser.add_argument("--query", "-q", required=True, help="Query text")
    # parser.add_argument("--k", type=int, default=5, help="Number of results")
    # parser.add_argument("--alpha", type=float, default=0.7, help="Weight for vector score (0..1)")
    # parser.add_argument("--db", type=str, default=None, help="Path to lancedb_store (overrides auto-detect)")
    # parser.add_argument("--table", type=str, default="documents", help="Table name to search")
    # args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    db_dir = Path(args.db) if args.db else find_db_dir(script_dir)

    if not db_dir.exists():
        print(f"LanceDB directory not found: {db_dir}")
        sys.exit(1)

    print(f"Connecting to LanceDB at: {db_dir}")
    db = connect(str(db_dir))

    try:
        df = load_table(db, args.table)
    except Exception as e:
        print(e)
        sys.exit(1)

    results = hybrid_search(df, args.query, k=args.k, alpha=args.alpha)

    # Print results
    def highlight(text: str, query: str) -> str:
        if not text:
            return ""
        tokens = set(re.findall(r"\w+", query.lower()))
        def repl(m):
            w = m.group(0)
            return w.upper() if w.lower() in tokens else w
        return re.sub(r"\w+", repl, text)

    def pretty_print(results_df: pd.DataFrame, query: str):
        for i, row in results_df.reset_index(drop=True).iterrows():
            title = row.get("text") or row.get("filename") or "(no title)"
            vid = row.get("id")
            vec = float(row.get("vector_score") or 0.0)
            lex = float(row.get("lexical_score") or 0.0)
            score = float(row.get("score") or 0.0)
            # determine dominant signal
            reason = "mixed"
            if vec >= lex + 0.05:
                reason = "vector"
            elif lex >= vec + 0.05:
                reason = "lexical"

            # snippet from text if available
            snippet = ""
            if "text" in row.index and row.get("text"):
                snippet = str(row.get("text"))
            elif "filename" in row.index:
                snippet = str(row.get("filename"))
            # shorten snippet
            snippet = (snippet or "").replace("\n", " ")
            if len(snippet) > 160:
                snippet = snippet[:157] + "..."
            snippet = highlight(snippet, query)

            print(f"{i+1}) {title} (id={vid}) — score={score:.3f} vec={vec:.2f} lex={lex:.2f} [{reason}]")
            if snippet:
                print(f"    {snippet}")

    pretty_print(results, args.query)


if __name__ == "__main__":
    main()
