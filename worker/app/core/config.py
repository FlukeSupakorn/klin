"""Application configuration using Pydantic Settings."""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Server
    PORT: int = 7071
    HOST: str = "127.0.0.1"
    
    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"
    MODEL_NAME: str = "qwen3-vl:2b"
    HTTP_TIMEOUT: int = 120
    
    # File Processing
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_EXTENSIONS: list[str] = [
        ".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".md",
        ".jpg", ".jpeg", ".png", ".bmp", ".tiff"
    ]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # "json" or "text"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
