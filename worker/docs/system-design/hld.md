# **High-Level System Design**

## **System Architecture Defined**

The system follows a **Hybrid Desktop–Worker Architecture** consisting of three major layers:

1. **Desktop Application Layer (Tauri + React)** – provides the graphical UI, handles user interactions, file selection, preview, and sends operations to the worker service.
2. **Local Worker Service Layer (FastAPI/Python)** – runs offline on the same machine, processes files, performs OCR/LLM inference, extracts embeddings, generates organize plans, and executes file operations.
3. ~~**Optional Cloud AI Layer (OpenRouter or Self-hosted LLM Gateway)** – processes base64 files or extracted text when the user chooses cloud-based models instead of local inference.~~

The architecture is designed so that:

* UI stays lightweight (React).
* Heavy computations (OCR, embeddings, AI planning) run in the worker.
* File operations are executed locally to prevent privacy risks.
* Cloud LLM calls happen only when explicitly enabled.

**Key architectural style:**

* **Client–Worker Model**
* **Modular Micro-services inside local machine**
* **Clean Architecture principles (UI → Worker → Domain Logic)**
* **Event-driven Organize Pipeline**

---

## **Technology Stack Selected**

### **Frontend (Desktop UI)**

* **Tauri** – native desktop wrapper
* **React + TypeScript** – interactive frontend framework
* **Shadcn/UI** – component library
* **Vite** – build tool

### **Local Backend Worker**

* **FastAPI** – lightweight local HTTP service
* **Python 3.11+** – main execution environment
* **Pydantic** – data validation
* **uvicorn** – worker server runtime
* **pdfplumber / docx2txt / pytesseract** – document parsing & OCR
* **LLM Client (OpenAI-compatible)** – local or cloud AI inference
* **LanceDB / SQLite** – local data storage

### **AI and Processing**

* **Local VLM (e.g., Qwen3-VL 2B via Ollama)**
* **Cloud AI (OpenRouter AI Gateway)**
* **Embedding models (text, image)**

### **Packaging & Distribution**

* **Tauri Sidecar** for bundling FastAPI worker
* **Rust** for system-level file handling

---

## **Modules and Components Identified**

Below is a structured module breakdown:

---

### **A. Desktop Application (Tauri UI Layer)**

1. **Folder Selection Module**

   * Select Watcher folders
   * Select Destination folders

2. **Preview + Validation Module**

   * Show AI output
   * Allow edit folder destination
   * Allow rename

3. **Organize Control Module**

   * Manual organize
   * Auto-organize toggle

4. **Notes & Calendar Module**

   * Summaries
   * Generated events
   * Notes linked to files

5. **Duplicate Scanner Module**

   * Scan folder
   * Show duplicates
   * Delete or move

6. **Settings Module**

   * AI model selection
   * Local vs Cloud
   * Theme, language, behavior

---

### **B. Worker Service (FastAPI Layer)**

1. **Ingestion Module**

   * Receive file path
   * Convert → base64 (if cloud inference)
   * Extract text / OCR
   * Chunking

2. **Embedding & Classification Module**

   * Generate embeddings
   * Determine file category
   * Confidence score

3. **LLM Planning Module**

   * Decide action (move, rename, summarize)
   * Produce structured plan

4. **Organize Executor Module**

   * Move files
   * Rename files
   * Undo/Redo support

5. **Duplicate Detection Module**

   * Hashing library
   * Duplicate clustering

6. **Logging Module**

   * Activity Log
   * Error tracking
   * File Health Log

---

## **Data Flow Diagrams (DFD – High Level)**

### **DFD Level 0 – Context Diagram**

```
User
 │
 ▼
Tauri Desktop App ───────► FastAPI Worker ───────► Local AI
 │                             │
 │                             ▼
 └────────────◄──────────── File System (move/rename/delete)
```

### **DFD Level 1 – File Organize Flow**

```
[User selects folder]
        │
        ▼
[Desktop App watches folder]
        │ detects new file
        ▼
[Send file path to FastAPI Worker]
        │
        ▼
[Worker extracts text/OCR] ---> [Embedding]
        │
        ▼
[LLM Plan Generation]
  - category
  - destination folder
  - rename suggestion
        │
        ▼
[Return plan to UI]
        │
   Preview / Edit
        ▼
[User confirms]
        │
        ▼
[Worker executes]
  move / rename / delete
        │
        ▼
[Activity Log + Undo/Redo]
```

---

## **Security Design Overview**

The design aims to guarantee **file privacy, data protection, and controlled access**.

---

### **A. Data Privacy Model**

1. **Local-first architecture**

   * All file content is processed locally by default.
   * No file leaves the user’s device unless cloud AI is explicitly enabled.

2. **Zero-retention policy**

   * Worker does **not store** document content.
   * Only metadata such as filename, category, and actions are logged.

---

### **B. Communication Security**

* ~~**HTTPS/TLS** enforced for any cloud AI calls.~~
* Tauri ↔ FastAPI communication occurs on **localhost**, preventing network exposure.
* API endpoints require local IPC only; no external ports are opened.

---

### **C. File Operation Safety**

* Before deleting a file, the system prompts for confirmation.
* Deleted files may be moved to a “trash” directory instead of permanent deletion.
* Organize actions are fully reversible using Undo.

---

### **D. Worker Sandboxing**

* FastAPI Worker runs in a restricted runtime:

  * No external internet access unless needed for cloud AI.
  * Limited file permissions (access only to watched directories).

---
