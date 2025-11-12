"""Ollama LLM adapter for universal document text extraction via OCR."""
import base64
from pathlib import Path
from typing import Dict, Any

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def convert_to_base64(file_path: str) -> str:
    """
    Convert any file to base64 encoding.
    
    Args:
        file_path: Path to the file (PDF, image, DOCX, PPTX, XLSX, etc.)
        
    Returns:
        Base64 encoded string
    """
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def get_extraction_prompt(extension: str) -> str:
    """
    Generate appropriate extraction prompt based on file type.
    
    Args:
        extension: File extension (e.g., '.pdf', '.docx', '.xlsx')
        
    Returns:
        Optimized prompt for the file type
    """
    prompts = {
        '.pdf': (
            "You are an OCR and document extraction model. "
            "Read the content of this PDF file and extract all readable text. "
            "Preserve layout and structure using markdown formatting where appropriate. "
            "Return only the extracted text, no explanations."
        ),
        '.docx': (
            "You are a document extraction model. "
            "Read the content of this Word document and extract all text. "
            "Preserve formatting using markdown (headings, lists, tables). "
            "Return only the extracted text, no explanations."
        ),
        '.pptx': (
            "You are a presentation extraction model. "
            "Read the content of this PowerPoint file and extract all text from slides. "
            "Organize content by slide with clear separators. "
            "Return only the extracted text, no explanations."
        ),
        '.xlsx': (
            "You are a spreadsheet extraction model. "
            "Read the content of this Excel file and extract all text and data. "
            "Organize by sheets and preserve table structure using markdown. "
            "Return only the extracted data, no explanations."
        ),
    }
    
    # Default prompt for images and other files
    default_prompt = (
        "You are an OCR and document extraction model. "
        "Read the content of this file and extract all readable text. "
        "If it's a structured document, preserve layout using markdown or clear formatting. "
        "Return only the extracted text, no explanations."
    )
    
    return prompts.get(extension.lower(), default_prompt)


async def extract_text_with_llm(
    file_path: str,
    mime_type: str | None = None,
) -> tuple[str, Dict[str, Any]]:
    """
    Extract text from ANY file type using Ollama LLM-based OCR.
    
    This unified function:
    1. Converts the file to base64 (works for PDF, images, DOCX, PPTX, XLSX, etc.)
    2. Sends it to a multimodal LLM (e.g., Qwen2-VL) via Ollama
    3. Returns the extracted text as plain text or markdown
    
    Args:
        file_path: Path to the file
        mime_type: Optional MIME type of the file
        
    Returns:
        Tuple of (extracted_text, metadata)
        
    Raises:
        httpx.HTTPError: If the request to Ollama fails
    """
    settings = get_settings()
    extension = Path(file_path).suffix.lower()
    
    try:
        # Convert file to base64
        logger.info(f"Converting {file_path} ({extension}) to base64 for LLM processing")
        base64_data = convert_to_base64(file_path)
        
        # Get appropriate prompt for file type
        prompt = get_extraction_prompt(extension)
        
        # Prepare request payload for Ollama LLM
        payload = {
            "model": settings.MODEL_NAME,
            "prompt": prompt,
            "images": [base64_data],
            "stream": False,
            "options": {
                "temperature": 0.1,  # Low temperature for more deterministic output
            }
        }
        
        # Call Ollama API
        url = f"{settings.OLLAMA_BASE_URL}/api/generate"
        logger.info(f"Calling Ollama LLM at {url} with model {settings.MODEL_NAME}")
        
        async with httpx.AsyncClient(timeout=settings.HTTP_TIMEOUT) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            
            result = response.json()
            extracted_text = result.get("response", "").strip()
            
            metadata = {
                "model": settings.MODEL_NAME,
                "method": "llm_ocr",
                "file_type": extension,
                "total_chars": len(extracted_text),
                "total_duration": result.get("total_duration"),
                "load_duration": result.get("load_duration"),
            }
            
            logger.info(
                f"LLM extraction completed for {extension}: {len(extracted_text)} chars, "
                f"duration: {metadata.get('total_duration', 'N/A')}ns"
            )
            
            return extracted_text, metadata
            
    except httpx.HTTPError as e:
        logger.error(f"HTTP error during LLM extraction for {file_path}: {e}")
        raise
    except Exception as e:
        logger.error(f"Failed LLM extraction for {file_path}: {e}")
        raise
