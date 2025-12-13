# **Detailed Design Documents (LLD Breakdown)**

Below is a breakdown for developer-level implementation.

---

## **A. Desktop Application (Tauri UI Layer)**

### **1. Folder Selection Module**

* Select Watcher folders
* Select Destination folders

---

### **2. Preview + Validation Module**

* Show AI output
* Allow edit folder destination
* Allow rename

---

### **3. Organize Control Module**

* Manual organize
* Auto-organize toggle

---

### **4. Notes & Calendar Module**

* Summaries
* Generated events
* Notes linked to files

---

### **5. Duplicate Scanner Module**

* Scan folder
* Show duplicates
* Delete or move

---

### **6. Settings Module**

* AI model selection
* Local vs Cloud
* Theme, language, behavior

---

## **B. Worker Service (FastAPI Layer)**

### **1. File Ingestion Module**

* Validate file type
* Extract text using VLM and fallback methods
  * PDFs: PyMuPDF, Tika
  * Images: OCR (Tesseract)
  * TXTs: direct read
* Compute SHA-256 and file size
* Store metadata in `file_records`
* Emit event for next module

---

### **2. Classification & Embedding Module**

* Use local VLM (Ollama)
* Extract categories using prompt templates
* Embedding generated using:

  * text embedding model
  * or vision encoder (if image)

---

### **3. Organize Planning Module (LLM Planning)**

* Calls LLM with:

  * extracted text
  * folder mapping rules
  * rename formatting rules
* Returns a structured JSON plan
* Decide action (move, rename, summarize)

---

### **4. Organize Execution Module**

* Execute filesystem operations using Rust
* Move files
* Rename files
* Save operation into `organize_history`
* Maintain Undo/Redo Stack

---

### **5. Duplicate Detection Module**

* Compute:

  * file hash
  * similarity via embedding (optional)
* Hashing library
* Duplicate clustering
* Insert records into `duplicate_records`
* Group duplicates for UI

---

### **6. Summary / Notes Module**

* Extract key ideas
* Create / update summary in DB
* Allow user edits

---

### **7. Calendar Module**

* Parse dates from content
* Create events in `calendar_events`
* Display in monthly/weekly views

---

### **8. Settings Module**

* Store JSON configuration
* Load settings on startup
* Model selection, watcher folders, and behavior toggles

---

### **9. Logging Module**

* Activity Log
* Error tracking
* File Health Log

---