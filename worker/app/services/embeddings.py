"""Service for generating embeddings using Ollama via LightRAG.

Replaces the previous langchain_ollama.OllamaEmbeddings with LightRAG's
native ollama_embed function.
"""
from functools import lru_cache

from lightrag.utils import EmbeddingFunc

from app.adapters.ollama_lightrag import get_embedding_func


@lru_cache
def get_embedding_model() -> EmbeddingFunc:
    """Get a cached instance of the Ollama embedding function (LightRAG-compatible)."""
    return get_embedding_func()
