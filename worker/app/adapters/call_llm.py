from pathlib import Path
import sys
import base64
import json

try:
    from langchain_ollama import OllamaLLM
except Exception:
    OllamaLLM = None

def read_file_bytes(path: Path) -> bytes:
    return path.read_bytes()

def to_base64(b: bytes) -> str:
    return base64.b64encode(b).decode("utf-8")

def extract_text_from_pdf(path: Path) -> str | None:
    # Try PyPDF2 first
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

def call_llm(prompt: str) -> str:
    if OllamaLLM is None:
        raise RuntimeError("langchain_ollama.OllamaLLM not available. Install 'langchain-ollama' and the Ollama server if required.")

    # Create LLM instance. Model name here mirrors the project's example; change if needed.
    llm = OllamaLLM(model="gemma3:4b")
    # OllamaLLM uses .invoke() in the project's example
    resp = llm.invoke(prompt)
    # Some wrappers return objects; ensure string
    if isinstance(resp, (list, dict)):
        return json.dumps(resp)
    return str(resp)

def parse_json_response(text: str) -> dict | None:
    # Try to find the first JSON substring
    try:
        return json.loads(text)
    except Exception:
        # fallback: try to extract {...}
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start:end+1])
            except Exception:
                return None
        return None

def load_json_file(path: Path) -> dict | list | None:
    if not path.exists():
        print(f"Warning: File not found: {path}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"Error reading {path}: {e}")
        return None

def build_organize_prompt(filename: str, extracted_text: str | None, base64_text: str, destinations: list[str]) -> str:
    dest_list = "\n".join([f"- {d}" for d in destinations])
    
    template = (
        "You are an intelligent file organizer.\n"
        "Analyze the provided file content/metadata and choose the most appropriate destination folder from the list below.\n"
        "Also suggest a clean, descriptive filename (rename) if the current one is messy, otherwise keep it.\n"
        "Provide a confidence score (0.0 to 1.0).\n\n"
        "Available Destinations:\n"
        "{dest_list}\n\n"
        "File Information:\n"
        "Filename: {filename}\n"
        "Extracted Text (start): {extracted_text}\n"
        "Base64 Preview (truncated): {base64_preview}\n\n"
        "Respond with a JSON object ONLY, following this exact structure:\n"
        "{{\n"
        "  \"move\": \"<selected_destination_path>\",\n"
        "  \"rename\": \"<suggested_filename>\",\n"
        "  \"summary\": \"<brief_summary_of_file>\",\n"
        "  \"duplicate\": null,\n"
        "  \"confidence\": <float_score>\n"
        "}}\n"
        "If no destination fits well, you may set \"move\" to null or suggest a new folder path.\n"
    )

    base64_preview = base64_text[:2000]
    prompt = template.format(
        dest_list=dest_list,
        filename=filename,
        extracted_text=(extracted_text[:1000] if extracted_text else ""),
        base64_preview=base64_preview
    )
    return prompt

#TODO: turn into function
def main():
    # Define paths
    base_dir = Path(__file__).resolve().parent.parent / "db" / "jsondb"
    organize_path = base_dir / "organize.json"
    destination_path = base_dir / "destination.json"
    result_path = base_dir / "result.json"

    # Load inputs
    organize_data = load_json_file(organize_path)
    destination_data = load_json_file(destination_path)

    if not organize_data or "organize" not in organize_data:
        print("No files to organize found in organize.json")
        sys.exit(1)
    
    if not destination_data or "destination" not in destination_data:
        print("No destinations found in destination.json")
        sys.exit(1)

    files_to_process = organize_data["organize"]
    destinations = destination_data["destination"]
    
    results = {}

    print(f"Found {len(files_to_process)} files to process.")

    for file_path_str in files_to_process:
        path = Path(file_path_str)
        print(f"\nProcessing: {path}")
        
        if not path.exists():
            print(f"  Error: File not found at {path}")
            results[str(path)] = {
                "move": None,
                "rename": None,
                "summary": None,
                "duplicate": None,
                "confidence": 0.0,
                "error": "File not found"
            }
            continue

        # Extract content
        suffix = path.suffix.lower()
        extracted_text = None
        b = read_file_bytes(path)
        b64 = to_base64(b)

        if suffix in (".txt", ".md", ".text"):
            try:
                extracted_text = path.read_text(encoding="utf-8")
            except Exception:
                extracted_text = None
        elif suffix == ".pdf":
            extracted_text = extract_text_from_pdf(path)
        
        # Build prompt and call LLM
        prompt = build_organize_prompt(path.name, extracted_text, b64, destinations)
        
        print("  Calling LLM...")
        try:
            resp_text = call_llm(prompt)
            parsed = parse_json_response(resp_text)
            
            if parsed:
                # Ensure all fields are present
                parsed.setdefault("duplicate", None)
                parsed.setdefault("summary", None)
                results[str(path)] = parsed
                print("  Success.")
            else:
                print("  Failed to parse LLM response.")
                results[str(path)] = {"error": "Failed to parse LLM response", "raw": resp_text}
                
        except Exception as e:
            print(f"  Error calling LLM: {e}")
            results[str(path)] = {"error": str(e)}

    # Write result
    output = {"result": results}
    try:
        result_path.write_text(json.dumps(output, ensure_ascii=False, indent=4), encoding="utf-8")
        print(f"\nSaved results to {result_path}")
    except Exception as e:
        print(f"Error writing result file: {e}")

if __name__ == "__main__":
    main()