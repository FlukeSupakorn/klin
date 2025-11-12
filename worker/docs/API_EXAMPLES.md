# API Testing Examples

## 1. Health Check

```bash
curl http://127.0.0.1:7071/v1/health
```

Expected response:
```json
{"ok": true}
```

## 2. Organize Files - Simple File

```bash
curl -X POST http://127.0.0.1:7071/v1/organize \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"path": "/Users/sarun/Work/Senior/klin/worker/README.md"}
    ],
    "destinations": [
      {"path": "/Users/sarun/Documents"}
    ],
    "options": {
      "allow_vlm_ocr": true,
      "make_summaries": false,
      "allow_renames": true
    }
  }'
```

## 3. Organize Multiple Files with Summaries

```bash
curl -X POST http://127.0.0.1:7071/v1/organize \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"path": "/path/to/document1.pdf"},
      {"path": "/path/to/document2.docx"}
    ],
    "destinations": [
      {"path": "/Users/sarun/Documents"},
      {"path": "/Users/sarun/Work"}
    ],
    "options": {
      "allow_vlm_ocr": true,
      "make_summaries": true,
      "allow_renames": true,
      "allow_duplicates": true
    }
  }'
```

## 4. Organize Image Files with VLM OCR

For image files (PNG, JPG, etc.), the API will use the Qwen3-VL model to extract text:

```bash
curl -X POST http://127.0.0.1:7071/v1/organize \
  -H "Content-Type: application/json" \
  -d '{
    "files": [
      {"path": "/path/to/receipt.png"},
      {"path": "/path/to/invoice.pdf"}
    ],
    "destinations": [
      {"path": "/Users/sarun/Documents/Receipts"},
      {"path": "/Users/sarun/Documents/Invoices"}
    ],
    "options": {
      "allow_vlm_ocr": true,
      "make_summaries": true
    }
  }'
```

## Example Response

```json
{
  "request_id": "org_abc123def456",
  "results": [
    {
      "file_sha256": "c2f9...a1",
      "origin_path": "/Users/sarun/Downloads/invoice.pdf",
      "status": "ok",
      "action": {
        "move": "/Users/sarun/Documents/Invoices",
        "rename": "invoice_2025_11.pdf",
        "duplicate_of": null,
        "summary": "- Purpose: Monthly invoice\n- Amount: 3,500 THB",
        "confidence": 0.91,
        "reason": "Keywords: 'Invoice', 'Amount due'."
      },
      "error": null,
      "meta": {
        "mime_type": "application/pdf",
        "size_bytes": 203944,
        "sha256": "c2f9...a1",
        "pages": 2,
        "extension": ".pdf"
      }
    }
  ]
}
```

## Using Python

```python
import requests
import json

# Organize files
response = requests.post(
    "http://127.0.0.1:7071/v1/organize",
    json={
        "files": [
            {"path": "/path/to/your/file.pdf"}
        ],
        "destinations": [
            {"path": "/Users/sarun/Documents"},
            {"path": "/Users/sarun/Work"}
        ],
        "options": {
            "allow_vlm_ocr": True,
            "make_summaries": True,
            "allow_renames": True
        }
    }
)

result = response.json()
print(json.dumps(result, indent=2))

# Access organization plan
for item in result["results"]:
    if item["status"] == "ok":
        print(f"\nFile: {item['origin_path']}")
        print(f"Move to: {item['action']['move']}")
        print(f"Rename to: {item['action']['rename']}")
        print(f"Summary: {item['action']['summary']}")
```

## Supported File Types

- **Documents**: PDF, DOCX, PPTX, XLSX, TXT
- **Images** (with VLM OCR): JPG, JPEG, PNG, BMP, TIFF

## Features

1. **File Organization Plans**: Worker generates plans but NEVER moves files (Tauri executes)
2. **Text Extraction**: Extracts text from various document formats internally
3. **VLM-based OCR**: Uses Qwen3-VL model for images and scanned PDFs
4. **Smart Rename Suggestions**: LLM-based filename recommendations
5. **Duplicate Detection**: Identifies duplicates via SHA-256 hashing
6. **Optional Summaries**: Markdown summaries for each file
7. **Destination Whitelist**: Only suggests moves to allowed destinations
