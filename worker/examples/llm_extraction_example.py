"""
Example: Using the new LLM-based extraction system

This demonstrates how to use the simplified extraction API
that works with all file types through a single LLM call.
"""
import asyncio
from app.adapters.ollama_vlm import extract_text_with_llm


async def extract_from_file(file_path: str):
    """
    Extract text from any supported file using LLM-based OCR.
    
    Works with:
    - PDF files (including scanned PDFs)
    - Word documents (.docx)
    - PowerPoint presentations (.pptx)
    - Excel spreadsheets (.xlsx)
    - Images (.jpg, .png, .bmp, .tiff, .gif)
    """
    print(f"\n🔍 Processing: {file_path}")
    print("=" * 60)
    
    try:
        # Single function call for ALL file types
        text, metadata = await extract_text_with_llm(file_path)
        
        print(f"✅ Extraction successful!")
        print(f"📄 File type: {metadata['file_type']}")
        print(f"🤖 Model: {metadata['model']}")
        print(f"📊 Extracted {metadata['total_chars']} characters")
        print(f"⏱️  Duration: {metadata['total_duration']}ns")
        print(f"\n📝 Extracted text (first 200 chars):")
        print("-" * 60)
        print(text[:200] + "..." if len(text) > 200 else text)
        
    except Exception as e:
        print(f"❌ Error: {e}")


async def main():
    """
    Demo: Extract text from different file types
    """
    # Example files (replace with your actual file paths)
    example_files = [
        "C:/Users/noone/Downloads/67-10-22-266-274-671027+ปัจจัยที่มีอิทธิพลต่อการตัดสินใจใช้ระบบ.pdf",
        "C:/Users/noone/Downloads/GEN421 Project.pdf"
    ]
    
    print("🚀 LLM-Based Text Extraction Demo")
    print("=" * 60)
    print("All file types processed through a single unified function!")
    
    # Process each file
    for file_path in example_files:
        await extract_from_file(file_path)
        print()


if __name__ == "__main__":
    # Before running:
    # 1. Make sure Ollama is running: ollama serve
    # 2. Pull a multimodal model: ollama pull qwen2-vl:2b
    # 3. Update the file paths in main()
    
    asyncio.run(main())
