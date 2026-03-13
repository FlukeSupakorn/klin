"""Ollama adapter for LightRAG / RAG-Anything integration.

Provides async model functions compatible with LightRAG's expected signatures:
- llm_model_func: text completion
- vision_model_func: multimodal VLM completion (text + image)
- embedding_func: text embedding via EmbeddingFunc wrapper

Uses the native ollama Python client for LLM/VLM, and LightRAG's
built-in ollama_embed for embeddings.
"""

from __future__ import annotations

import base64
from functools import partial
from typing import Any

import numpy as np
from lightrag.llm.ollama import ollama_model_complete, ollama_embed
from lightrag.utils import EmbeddingFunc

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


# ---------------------------------------------------------------------------
# LLM text completion (LightRAG native)
# ---------------------------------------------------------------------------

def get_llm_model_func():
    """
    Return the LightRAG-compatible LLM completion function for Ollama.
    
    LightRAG's ollama_model_complete reads model name from
    ``kwargs["hashing_kv"].global_config["llm_model_name"]`` at call-time,
    so we return it directly.
    """
    return ollama_model_complete


# ---------------------------------------------------------------------------
# Vision model function (for multimodal VLM queries)
# ---------------------------------------------------------------------------

async def ollama_vision_model_func(
    prompt: str,
    system_prompt: str | None = None,
    history_messages: list[dict] | None = None,
    image_data: str | None = None,
    messages: list[dict] | None = None,
    **kwargs,
) -> str:
    """
    Multimodal VLM function for RAG-Anything.

    Supports two calling conventions used by RAG-Anything:
    1. ``messages`` list (OpenAI-style with image_url base64)
    2. ``image_data`` (raw base64 string) + ``prompt``

    Falls back to text-only completion when no image is provided.
    """
    import httpx
    settings = get_settings()

    # Build the prompt with optional system prompt
    full_prompt = prompt
    if system_prompt:
        full_prompt = f"{system_prompt}\n\n{prompt}"

    # Determine image payload
    images: list[str] = []

    if messages:
        # Extract base64 images from OpenAI-style messages
        for msg in messages:
            if isinstance(msg, dict) and msg.get("role") == "user":
                content = msg.get("content")
                if isinstance(content, list):
                    for part in content:
                        if isinstance(part, dict):
                            if part.get("type") == "image_url":
                                url = part.get("image_url", {}).get("url", "")
                                # Strip data URI prefix
                                if url.startswith("data:"):
                                    b64 = url.split(",", 1)[-1]
                                    images.append(b64)
                            elif part.get("type") == "text":
                                full_prompt = part.get("text", full_prompt)
    elif image_data:
        # Strip data URI prefix if present
        if image_data.startswith("data:"):
            image_data = image_data.split(",", 1)[-1]
        images.append(image_data)

    # Call Ollama /api/generate (supports images natively)
    payload: dict[str, Any] = {
        "model": settings.MODEL_NAME,
        "prompt": full_prompt,
        "stream": False,
        "options": {"temperature": 0.1},
    }
    if images:
        payload["images"] = images

    url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()
        result = response.json()
        return result.get("response", "").strip()


def get_vision_model_func():
    """Return the vision model function for RAG-Anything."""
    return ollama_vision_model_func


# ---------------------------------------------------------------------------
# Embedding function
# ---------------------------------------------------------------------------

def get_embedding_func() -> EmbeddingFunc:
    """
    Create an EmbeddingFunc wrapping Ollama's embedding endpoint.

    Uses LightRAG's built-in ``ollama_embed`` with ``.func`` to access
    the unwrapped function (avoids double-wrapping by EmbeddingFunc).
    """
    settings = get_settings()

    return EmbeddingFunc(
        embedding_dim=settings.EMBEDDING_DIM,
        max_token_size=8192,
        func=partial(
            ollama_embed.func,  # unwrapped function
            embed_model=settings.EMBEDDING_MODEL,
            host=settings.OLLAMA_BASE_URL,
        ),
    )
