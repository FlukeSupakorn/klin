"""Utility functions for file operations."""
import hashlib
from pathlib import Path


def calculate_sha256(file_path: str) -> str:
    """
    Calculate SHA-256 hash of a file.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Hexadecimal SHA-256 hash string
    """
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        # Read in chunks to handle large files
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def is_allowed_extension(file_path: str, allowed_extensions: list[str]) -> bool:
    """
    Check if file has an allowed extension.
    
    Args:
        file_path: Path to the file
        allowed_extensions: List of allowed extensions (e.g., ['.pdf', '.docx'])
        
    Returns:
        True if extension is allowed
    """
    extension = Path(file_path).suffix.lower()
    return extension in [ext.lower() for ext in allowed_extensions]


def get_file_size_mb(file_path: str) -> float:
    """
    Get file size in megabytes.
    
    Args:
        file_path: Path to the file
        
    Returns:
        File size in MB
    """
    size_bytes = Path(file_path).stat().st_size
    return size_bytes / (1024 * 1024)
