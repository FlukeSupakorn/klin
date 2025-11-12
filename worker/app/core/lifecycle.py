"""Application lifecycle management (startup/shutdown events)."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import setup_logging, get_logger

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    Handles startup and shutdown events.
    """
    # Startup
    settings = get_settings()
    setup_logging(log_level=settings.LOG_LEVEL, log_format=settings.LOG_FORMAT)
    
    logger.info(
        "Application starting",
        extra={
            "port": settings.PORT,
            "ollama_url": settings.OLLAMA_BASE_URL,
            "model": settings.MODEL_NAME,
        }
    )
    
    # Check Ollama connectivity (optional)
    try:
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.OLLAMA_BASE_URL}/api/tags",
                timeout=5.0
            )
            if response.status_code == 200:
                logger.info("Successfully connected to Ollama")
            else:
                logger.warning(f"Ollama returned status {response.status_code}")
    except Exception as e:
        logger.warning(f"Could not connect to Ollama: {e}")
    
    yield
    
    # Shutdown
    logger.info("Application shutting down")
