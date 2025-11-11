# Backend Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Commands](#commands)
- [File Operations](#file-operations)
- [Note Operations](#note-operations)
- [Data Structures](#data-structures)
- [Error Handling](#error-handling)
- [Platform Support](#platform-support)

## Overview

The backend is built with Tauri v2 and Rust, providing native file system access, secure command invocation, and cross-platform compatibility.

### Tech Stack
- **Tauri v2** - Desktop application framework
- **Rust** - Systems programming language
- **Serde** - Serialization/deserialization
- **Tauri Plugins:**
  - `tauri-plugin-dialog` - Native file dialogs
  - `tauri-plugin-opener` - Open files with system apps

## Architecture

### Project Structure

```
src-tauri/
├── src/
│   ├── lib.rs              # Main entry point and command registration
│   ├── main.rs             # Application runner
│   ├── file_ops.rs         # File system operations
│   └── note_ops.rs         # Note management operations
│
├── Cargo.toml              # Rust dependencies and metadata
├── tauri.conf.json         # Tauri configuration
├── build.rs                # Build script
└── icons/                  # Application icons
```

### Module Overview

**lib.rs** - Application Entry Point
- Initializes Tauri builder
- Registers plugins
- Sets up command handlers
- Runs the application

**file_ops.rs** - File System Module
- Read folders
- Open files with system application
- Delete files and directories
- Create folders
- Read file contents

**note_ops.rs** - Note Management Module
- CRUD operations for markdown notes
- Note metadata management
- File naming with timestamps
- Note export functionality

## Commands

All Tauri commands follow this pattern:

```rust
#[tauri::command]
fn command_name(param: Type) -> Result<ReturnType, String> {
    // Implementation
}
```

Commands are invoked from the frontend using:

```typescript
import { invoke } from '@tauri-apps/api/core'

const result = await invoke('command_name', { param: value })
```

### Registered Commands

| Command | Module | Description |
|---------|--------|-------------|
| `greet` | file_ops | Demo greeting command |
| `get_downloads_folder` | file_ops | Get system downloads directory |
| `read_folder` | file_ops | Read folder contents |
| `open_file` | file_ops | Open file with default app |
| `delete_file` | file_ops | Delete file or directory |
| `create_folder` | file_ops | Create new folder |
| `read_file_content` | file_ops | Read text file content |
| `list_notes` | note_ops | List all notes |
| `create_note` | note_ops | Create new note |
| `read_note` | note_ops | Read note content |
| `update_note` | note_ops | Update note content |
| `delete_note` | note_ops | Delete note |
| `rename_note` | note_ops | Rename note |
| `download_note` | note_ops | Export note to file system |

## File Operations

### Module: `file_ops.rs`

#### Data Structures

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct FileItem {
    pub name: String,       // File/folder name
    pub path: String,       // Full path
    pub is_dir: bool,       // Is directory?
    pub size: u64,          // Size in bytes
    pub modified: Option<String>,  // Unix timestamp as string
}
```

---

### 1. greet

**Purpose:** Demo command for testing

**Signature:**
```rust
#[tauri::command]
pub fn greet(name: &str) -> String
```

**Parameters:**
- `name: &str` - Name to greet

**Returns:**
- `String` - Greeting message

**Example:**
```typescript
const greeting = await invoke('greet', { name: 'World' })
// Returns: "Hello, World! You've been greeted from Rust!"
```

---

### 2. get_downloads_folder

**Purpose:** Get the system's downloads directory path

**Signature:**
```rust
#[tauri::command]
pub fn get_downloads_folder() -> Result<String, String>
```

**Returns:**
- `Ok(String)` - Downloads folder path
- `Err(String)` - Error message

**Example:**
```typescript
try {
  const downloadPath = await invoke('get_downloads_folder')
  console.log(downloadPath)  // e.g., "C:\\Users\\User\\Downloads"
} catch (error) {
  console.error(error)
}
```

**Error Cases:**
- Downloads folder not found
- Invalid path encoding

---

### 3. read_folder

**Purpose:** Read contents of a directory

**Signature:**
```rust
#[tauri::command]
pub fn read_folder(folder_path: String) -> Result<Vec<FileItem>, String>
```

**Parameters:**
- `folder_path: String` - Absolute path to folder

**Returns:**
- `Ok(Vec<FileItem>)` - Array of files and folders
- `Err(String)` - Error message

**Example:**
```typescript
const items = await invoke('read_folder', { 
  folderPath: 'C:\\Users\\User\\Documents' 
})

items.forEach(item => {
  console.log(`${item.name} - ${item.is_dir ? 'DIR' : 'FILE'} - ${item.size} bytes`)
})
```

**FileItem Structure:**
```typescript
interface FileItem {
  name: string           // "document.pdf"
  path: string          // "C:\\Users\\User\\Documents\\document.pdf"
  is_dir: boolean       // false
  size: number          // 1024000 (bytes)
  modified: string | null  // "1699900000" (Unix timestamp)
}
```

**Error Cases:**
- Folder does not exist
- Permission denied
- Invalid path

---

### 4. open_file

**Purpose:** Open file with system's default application

**Signature:**
```rust
#[tauri::command]
pub fn open_file(file_path: String) -> Result<(), String>
```

**Parameters:**
- `file_path: String` - Absolute path to file

**Returns:**
- `Ok(())` - Success
- `Err(String)` - Error message

**Platform Behavior:**

**Windows:**
```rust
std::process::Command::new("cmd")
    .args(["/C", "start", "", &file_path])
    .spawn()
```

**macOS:**
```rust
std::process::Command::new("open")
    .arg(&file_path)
    .spawn()
```

**Linux:**
```rust
std::process::Command::new("xdg-open")
    .arg(&file_path)
    .spawn()
```

**Example:**
```typescript
try {
  await invoke('open_file', { 
    filePath: 'C:\\Users\\User\\Documents\\report.pdf' 
  })
  // PDF opens in default PDF reader
} catch (error) {
  console.error('Failed to open file:', error)
}
```

**Error Cases:**
- File does not exist
- No default application for file type
- Permission denied

---

### 5. delete_file

**Purpose:** Delete file or directory (recursive for directories)

**Signature:**
```rust
#[tauri::command]
pub fn delete_file(file_path: String) -> Result<(), String>
```

**Parameters:**
- `file_path: String` - Absolute path to file or folder

**Returns:**
- `Ok(())` - Success
- `Err(String)` - Error message

**Behavior:**
- If path is a **file**: Deletes the file
- If path is a **directory**: Recursively deletes directory and all contents

**Example:**
```typescript
// Delete file
await invoke('delete_file', { 
  filePath: 'C:\\Users\\User\\temp.txt' 
})

// Delete directory (recursive)
await invoke('delete_file', { 
  filePath: 'C:\\Users\\User\\OldFolder' 
})
```

**Error Cases:**
- File/folder does not exist
- Permission denied
- File is in use

**⚠️ Warning:** This operation is permanent and cannot be undone!

---

### 6. create_folder

**Purpose:** Create new folder (creates parent directories if needed)

**Signature:**
```rust
#[tauri::command]
pub fn create_folder(folder_path: String) -> Result<(), String>
```

**Parameters:**
- `folder_path: String` - Absolute path to new folder

**Returns:**
- `Ok(())` - Success
- `Err(String)` - Error message

**Behavior:**
- Creates parent directories automatically (like `mkdir -p`)
- No error if folder already exists

**Example:**
```typescript
await invoke('create_folder', { 
  folderPath: 'C:\\Users\\User\\NewProject\\src\\components' 
})
// Creates: NewProject, src, and components folders
```

**Error Cases:**
- Permission denied
- Invalid path
- Disk full

---

### 7. read_file_content

**Purpose:** Read text file content as string

**Signature:**
```rust
#[tauri::command]
pub fn read_file_content(file_path: String) -> Result<String, String>
```

**Parameters:**
- `file_path: String` - Absolute path to text file

**Returns:**
- `Ok(String)` - File content
- `Err(String)` - Error message

**Example:**
```typescript
const content = await invoke('read_file_content', { 
  filePath: 'C:\\Users\\User\\config.json' 
})

const config = JSON.parse(content)
```

**Error Cases:**
- File does not exist
- Path is a directory
- File is not valid UTF-8 text
- Permission denied

**Note:** Only for text files. Binary files will cause UTF-8 decoding errors.

---

## Note Operations

### Module: `note_ops.rs`

#### Data Structures

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct NoteItem {
    pub filename: String,    // "1699900000000-my-note.md"
    pub title: String,       // "my-note"
    pub content: String,     // Markdown content
    pub created: String,     // Unix timestamp
    pub modified: String,    // Unix timestamp
}
```

#### Notes Directory

Notes are stored in the application data directory:

**Windows:** `%APPDATA%\com.klin.app\notes\`
**macOS:** `~/Library/Application Support/com.klin.app/notes/`
**Linux:** `~/.local/share/com.klin.app/notes/`

**Helper Function:**
```rust
pub fn get_notes_dir(app: tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app.path().app_data_dir()?;
    let notes_dir = app_data_dir.join("notes");
    
    // Create if doesn't exist
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir)?;
    }
    
    Ok(notes_dir)
}
```

---

### 1. list_notes

**Purpose:** List all notes with metadata

**Signature:**
```rust
#[tauri::command]
pub fn list_notes(app: tauri::AppHandle) -> Result<Vec<NoteItem>, String>
```

**Returns:**
- `Ok(Vec<NoteItem>)` - Array of notes (sorted by modified date, newest first)
- `Err(String)` - Error message

**Example:**
```typescript
const notes = await invoke('list_notes')

notes.forEach(note => {
  console.log(`${note.title} - ${note.modified}`)
})
```

**NoteItem Structure:**
```typescript
interface NoteItem {
  filename: string      // "1699900000000-project-ideas.md"
  title: string        // "project-ideas"
  content: string      // "# Project Ideas\n\n- Idea 1\n- Idea 2"
  created: string      // "1699900000" (Unix timestamp)
  modified: string     // "1699910000" (Unix timestamp)
}
```

**Sorting:** Notes are sorted by `modified` timestamp in descending order (newest first)

---

### 2. create_note

**Purpose:** Create new note

**Signature:**
```rust
#[tauri::command]
pub fn create_note(
    app: tauri::AppHandle, 
    title: String, 
    content: String
) -> Result<String, String>
```

**Parameters:**
- `title: String` - Note title
- `content: String` - Markdown content

**Returns:**
- `Ok(String)` - Generated filename
- `Err(String)` - Error message

**Filename Format:**
```
{timestamp}-{sanitized-title}.md
```

**Title Sanitization:**
- Only alphanumeric, hyphens, and underscores allowed
- Other characters converted to hyphens
- Example: `"My Note!"` → `"my-note-"`

**Example:**
```typescript
const filename = await invoke('create_note', { 
  title: 'Meeting Notes',
  content: '# Meeting Notes\n\n- Topic 1\n- Topic 2'
})

console.log(filename)  // "1699900000000-meeting-notes.md"
```

**Error Cases:**
- Failed to create notes directory
- Permission denied
- Disk full

---

### 3. read_note

**Purpose:** Read note content

**Signature:**
```rust
#[tauri::command]
pub fn read_note(
    app: tauri::AppHandle, 
    filename: String
) -> Result<String, String>
```

**Parameters:**
- `filename: String` - Note filename (from list_notes)

**Returns:**
- `Ok(String)` - Note content (markdown)
- `Err(String)` - Error message

**Example:**
```typescript
const content = await invoke('read_note', { 
  filename: '1699900000000-meeting-notes.md' 
})

console.log(content)
// # Meeting Notes
// 
// - Topic 1
// - Topic 2
```

**Error Cases:**
- Note does not exist
- Permission denied
- File is not valid UTF-8

---

### 4. update_note

**Purpose:** Update note content

**Signature:**
```rust
#[tauri::command]
pub fn update_note(
    app: tauri::AppHandle, 
    filename: String, 
    content: String
) -> Result<(), String>
```

**Parameters:**
- `filename: String` - Note filename
- `content: String` - New markdown content

**Returns:**
- `Ok(())` - Success
- `Err(String)` - Error message

**Example:**
```typescript
await invoke('update_note', { 
  filename: '1699900000000-meeting-notes.md',
  content: '# Updated Meeting Notes\n\n- New topic'
})
```

**Behavior:**
- Overwrites entire file content
- Updates file's modified timestamp automatically

**Error Cases:**
- Note does not exist
- Permission denied
- Disk full

---

### 5. delete_note

**Purpose:** Delete note

**Signature:**
```rust
#[tauri::command]
pub fn delete_note(
    app: tauri::AppHandle, 
    filename: String
) -> Result<(), String>
```

**Parameters:**
- `filename: String` - Note filename

**Returns:**
- `Ok(())` - Success
- `Err(String)` - Error message

**Example:**
```typescript
await invoke('delete_note', { 
  filename: '1699900000000-old-note.md' 
})
```

**Error Cases:**
- Note does not exist
- Permission denied

**⚠️ Warning:** This operation is permanent!

---

### 6. rename_note

**Purpose:** Rename note (preserves timestamp)

**Signature:**
```rust
#[tauri::command]
pub fn rename_note(
    app: tauri::AppHandle, 
    old_filename: String, 
    new_title: String
) -> Result<String, String>
```

**Parameters:**
- `old_filename: String` - Current filename
- `new_title: String` - New title

**Returns:**
- `Ok(String)` - New filename
- `Err(String)` - Error message

**Behavior:**
- Extracts timestamp from old filename
- Sanitizes new title
- Creates new filename: `{original-timestamp}-{new-title}.md`
- Renames file on disk

**Example:**
```typescript
const newFilename = await invoke('rename_note', { 
  oldFilename: '1699900000000-old-title.md',
  newTitle: 'Updated Title'
})

console.log(newFilename)  // "1699900000000-updated-title.md"
```

**Error Cases:**
- Note does not exist
- Invalid filename format
- Permission denied
- New filename already exists

---

### 7. download_note

**Purpose:** Export note to file system with save dialog

**Signature:**
```rust
#[tauri::command]
pub async fn download_note(
    app: tauri::AppHandle, 
    filename: String
) -> Result<(), String>
```

**Parameters:**
- `filename: String` - Note filename

**Returns:**
- `Ok(())` - Success (or user cancelled)
- `Err(String)` - Error message

**Behavior:**
1. Reads note content
2. Opens native save dialog (`.md` filter)
3. Default filename: note title
4. Writes content to selected location

**Example:**
```typescript
await invoke('download_note', { 
  filename: '1699900000000-my-note.md' 
})
// Opens save dialog
// User selects location
// Note is exported
```

**Save Dialog Options:**
- File type filter: Markdown files (`.md`)
- Default extension: `.md`
- Default filename: Note title

**Error Cases:**
- Note does not exist
- User cancels dialog (returns Ok, no error)
- Permission denied at save location
- Disk full

---

## Data Structures

### FileItem

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct FileItem {
    pub name: String,           // "document.pdf"
    pub path: String,           // "/full/path/to/document.pdf"
    pub is_dir: bool,          // false
    pub size: u64,             // Size in bytes
    pub modified: Option<String>,  // Unix timestamp or None
}
```

**TypeScript Equivalent:**
```typescript
interface FileItem {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified: string | null
}
```

---

### NoteItem

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct NoteItem {
    pub filename: String,      // "1699900000000-note-title.md"
    pub title: String,         // "note-title"
    pub content: String,       // Full markdown content
    pub created: String,       // Unix timestamp
    pub modified: String,      // Unix timestamp
}
```

**TypeScript Equivalent:**
```typescript
interface NoteItem {
  filename: string
  title: string
  content: string
  created: string
  modified: string
}
```

---

## Error Handling

### Rust Side

All commands return `Result<T, String>`:

```rust
#[tauri::command]
pub fn my_command() -> Result<DataType, String> {
    match operation() {
        Ok(data) => Ok(data),
        Err(e) => Err(format!("Error message: {}", e))
    }
}
```

**Common Error Patterns:**

```rust
// File not found
if !path.exists() {
    return Err("File does not exist".to_string());
}

// Permission error
fs::read_file(&path)
    .map_err(|e| format!("Failed to read file: {}", e))?

// Custom validation
if input.is_empty() {
    return Err("Input cannot be empty".to_string());
}
```

### TypeScript Side

Handle errors with try-catch:

```typescript
try {
  const result = await invoke('command_name', { param: value })
  // Handle success
} catch (error) {
  console.error('Command failed:', error)
  // Show user-friendly error message
  toast({
    title: 'Error',
    description: String(error),
    variant: 'destructive'
  })
}
```

---

## Platform Support

### Supported Platforms

✅ **Windows** - Full support
✅ **macOS** - Full support  
✅ **Linux** - Full support

### Platform-Specific Code

**Opening Files:**

```rust
#[cfg(target_os = "windows")]
{
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &file_path])
        .spawn()?;
}

#[cfg(target_os = "macos")]
{
    std::process::Command::new("open")
        .arg(&file_path)
        .spawn()?;
}

#[cfg(target_os = "linux")]
{
    std::process::Command::new("xdg-open")
        .arg(&file_path)
        .spawn()?;
}
```

### Path Handling

**Always use `PathBuf` for cross-platform paths:**

```rust
use std::path::PathBuf;

let path = PathBuf::from(&folder_path);
let file_path = path.join("subfolder").join("file.txt");
```

**Convert to string:**

```rust
let path_string = path.to_string_lossy().to_string();
```

---

## Security Considerations

### Command Allowlist

Only registered commands can be invoked from frontend:

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    read_folder,
    open_file,
    // ... only listed commands are accessible
])
```

### Path Validation

Always validate paths before operations:

```rust
if !path.exists() {
    return Err("Path does not exist".to_string());
}

if !path.is_file() {
    return Err("Path is not a file".to_string());
}
```

### Content Security Policy

Configured in `tauri.conf.json`:

```json
{
  "security": {
    "csp": "default-src 'self'; script-src 'self' 'unsafe-inline'"
  }
}
```

---

## Development Tips

### Adding New Commands

1. **Create command function in appropriate module:**

```rust
// In file_ops.rs or note_ops.rs
#[tauri::command]
pub fn my_new_command(param: String) -> Result<String, String> {
    // Implementation
    Ok("Success".to_string())
}
```

2. **Register in lib.rs:**

```rust
.invoke_handler(tauri::generate_handler![
    // ... existing commands
    my_new_command
])
```

3. **Create TypeScript wrapper:**

```typescript
// In lib/tauri-api.ts
export const myNewCommand = async (param: string): Promise<string> => {
  return await invoke('my_new_command', { param })
}
```

### Debugging

**Enable Rust console output:**

```rust
println!("Debug: {:?}", variable);
eprintln!("Error: {}", error);
```

**View logs:**
- Windows: Open DevTools in app
- macOS: Run `Console.app` and filter by app name
- Linux: Check terminal output

### Testing Commands

Use Tauri's development tools:

```typescript
// In browser DevTools console
await window.__TAURI__.invoke('command_name', { param: 'value' })
```

---

## Performance Optimization

### Large File Operations

**Stream large files instead of loading into memory:**

```rust
use std::io::{BufReader, BufWriter};

let reader = BufReader::new(File::open(source)?);
let writer = BufWriter::new(File::create(dest)?);
std::io::copy(&mut reader, &mut writer)?;
```

### Async Operations

**Use async for I/O operations:**

```rust
#[tauri::command]
pub async fn async_operation() -> Result<String, String> {
    // Async implementation
}
```

### Caching

**Cache frequently accessed data:**

```rust
use std::sync::Mutex;

static CACHE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
```

---

[← Frontend Documentation](./FRONTEND.md) | [Back to Main README →](../README.md)
