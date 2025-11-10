use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct FileItem {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    modified: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct NoteItem {
    filename: String,
    title: String,
    content: String,
    created: String,
    modified: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_downloads_folder() -> Result<String, String> {
    dirs::download_dir()
        .ok_or_else(|| "Could not find downloads folder".to_string())
        .and_then(|path| {
            path.to_str()
                .ok_or_else(|| "Invalid path".to_string())
                .map(|s| s.to_string())
        })
}

#[tauri::command]
fn read_folder(folder_path: String) -> Result<Vec<FileItem>, String> {
    let path = PathBuf::from(&folder_path);
    
    if !path.exists() {
        return Err("Folder does not exist".to_string());
    }
    
    let mut items = Vec::new();
    
    match fs::read_dir(&path) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    let metadata = entry.metadata();
                    let file_name = entry.file_name().to_string_lossy().to_string();
                    
                    if let Ok(meta) = metadata {
                        let modified = meta.modified()
                            .ok()
                            .and_then(|time| {
                                time.duration_since(std::time::UNIX_EPOCH)
                                    .ok()
                                    .map(|d| d.as_secs().to_string())
                            });
                        
                        items.push(FileItem {
                            name: file_name,
                            path: entry.path().to_string_lossy().to_string(),
                            is_dir: meta.is_dir(),
                            size: meta.len(),
                            modified,
                        });
                    }
                }
            }
            Ok(items)
        }
        Err(e) => Err(format!("Failed to read folder: {}", e)),
    }
}

#[tauri::command]
fn open_file(file_path: String) -> Result<(), String> {
    let path = PathBuf::from(&file_path);
    
    if !path.exists() {
        return Err("File does not exist".to_string());
    }
    
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(["/C", "start", "", &file_path])
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }
    
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&file_path)
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&file_path)
            .spawn()
            .map_err(|e| format!("Failed to open file: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
fn delete_file(file_path: String) -> Result<(), String> {
    let path = PathBuf::from(&file_path);
    
    if !path.exists() {
        return Err("File does not exist".to_string());
    }
    
    if path.is_dir() {
        fs::remove_dir_all(&path)
            .map_err(|e| format!("Failed to delete directory: {}", e))?;
    } else {
        fs::remove_file(&path)
            .map_err(|e| format!("Failed to delete file: {}", e))?;
    }
    
    Ok(())
}

#[tauri::command]
fn create_folder(folder_path: String) -> Result<(), String> {
    let path = PathBuf::from(&folder_path);
    
    fs::create_dir_all(&path)
        .map_err(|e| format!("Failed to create folder: {}", e))?;
    
    Ok(())
}

// ============================================================================
// Note Commands
// ============================================================================

fn get_notes_dir(app: tauri::AppHandle) -> Result<PathBuf, String> {
    let app_data_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;
    
    let notes_dir = app_data_dir.join("notes");
    
    // Create notes directory if it doesn't exist
    if !notes_dir.exists() {
        fs::create_dir_all(&notes_dir)
            .map_err(|e| format!("Failed to create notes directory: {}", e))?;
    }
    
    Ok(notes_dir)
}

#[tauri::command]
fn list_notes(app: tauri::AppHandle) -> Result<Vec<NoteItem>, String> {
    let notes_dir = get_notes_dir(app)?;
    let mut notes = Vec::new();
    
    match fs::read_dir(&notes_dir) {
        Ok(entries) => {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.extension().and_then(|s| s.to_str()) == Some("md") {
                        let filename = entry.file_name().to_string_lossy().to_string();
                        let metadata = entry.metadata().ok();
                        
                        // Read file content
                        let content = fs::read_to_string(&path).unwrap_or_default();
                        
                        // Extract title from filename (remove timestamp and .md)
                        let title = filename
                            .trim_end_matches(".md")
                            .split('-')
                            .skip(1)
                            .collect::<Vec<_>>()
                            .join("-");
                        
                        let modified = metadata
                            .as_ref()
                            .and_then(|m| m.modified().ok())
                            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                            .map(|d| d.as_secs().to_string())
                            .unwrap_or_default();
                        
                        let created = metadata
                            .as_ref()
                            .and_then(|m| m.created().ok())
                            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
                            .map(|d| d.as_secs().to_string())
                            .unwrap_or_else(|| modified.clone());
                        
                        notes.push(NoteItem {
                            filename,
                            title,
                            content,
                            created,
                            modified,
                        });
                    }
                }
            }
        }
        Err(e) => return Err(format!("Failed to read notes directory: {}", e)),
    }
    
    // Sort by modified date (newest first)
    notes.sort_by(|a, b| b.modified.cmp(&a.modified));
    
    Ok(notes)
}

#[tauri::command]
fn create_note(app: tauri::AppHandle, title: String, content: String) -> Result<String, String> {
    let notes_dir = get_notes_dir(app)?;
    
    // Create filename with timestamp
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map_err(|e| format!("Failed to get timestamp: {}", e))?
        .as_millis();
    
    // Sanitize title for filename
    let safe_title: String = title
        .chars()
        .map(|c| if c.is_alphanumeric() || c == '-' || c == '_' { c } else { '-' })
        .collect();
    
    let filename = format!("{}-{}.md", timestamp, safe_title);
    let file_path = notes_dir.join(&filename);
    
    // Write content to file
    fs::write(&file_path, content)
        .map_err(|e| format!("Failed to write note: {}", e))?;
    
    Ok(filename)
}

#[tauri::command]
fn read_note(app: tauri::AppHandle, filename: String) -> Result<String, String> {
    let notes_dir = get_notes_dir(app)?;
    let file_path = notes_dir.join(&filename);
    
    if !file_path.exists() {
        return Err("Note does not exist".to_string());
    }
    
    fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read note: {}", e))
}

#[tauri::command]
fn update_note(app: tauri::AppHandle, filename: String, content: String) -> Result<(), String> {
    let notes_dir = get_notes_dir(app)?;
    let file_path = notes_dir.join(&filename);
    
    if !file_path.exists() {
        return Err("Note does not exist".to_string());
    }
    
    fs::write(&file_path, content)
        .map_err(|e| format!("Failed to update note: {}", e))
}

#[tauri::command]
fn delete_note(app: tauri::AppHandle, filename: String) -> Result<(), String> {
    let notes_dir = get_notes_dir(app)?;
    let file_path = notes_dir.join(&filename);
    
    if !file_path.exists() {
        return Err("Note does not exist".to_string());
    }
    
    fs::remove_file(&file_path)
        .map_err(|e| format!("Failed to delete note: {}", e))
}

#[tauri::command]
fn rename_note(app: tauri::AppHandle, old_filename: String, new_title: String) -> Result<String, String> {
    let notes_dir = get_notes_dir(app)?;
    let old_path = notes_dir.join(&old_filename);
    
    if !old_path.exists() {
        return Err("Note does not exist".to_string());
    }
    
    // Extract timestamp from old filename
    let timestamp = old_filename
        .split('-')
        .next()
        .ok_or_else(|| "Invalid filename format".to_string())?;
    
    // Sanitize new title for filename
    let safe_title: String = new_title
        .chars()
        .map(|c| if c.is_alphanumeric() || c == '-' || c == '_' { c } else { '-' })
        .collect();
    
    let new_filename = format!("{}-{}.md", timestamp, safe_title);
    let new_path = notes_dir.join(&new_filename);
    
    // Rename the file
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename note: {}", e))?;
    
    Ok(new_filename)
}

#[tauri::command]
async fn download_note(app: tauri::AppHandle, filename: String) -> Result<(), String> {
    let notes_dir = get_notes_dir(app.clone())?;
    let source_path = notes_dir.join(&filename);
    
    if !source_path.exists() {
        return Err("Note does not exist".to_string());
    }
    
    // Read the note content
    let content = fs::read_to_string(&source_path)
        .map_err(|e| format!("Failed to read note: {}", e))?;
    
    // Show save dialog
    use tauri_plugin_dialog::DialogExt;
    
    let file_path = app.dialog()
        .file()
        .set_file_name(&filename)
        .add_filter("Markdown", &["md"])
        .blocking_save_file();
    
    if let Some(path) = file_path {
        // Get the path as a string and convert to PathBuf
        let path_str = path.to_string();
        let path_buf = PathBuf::from(path_str);
        fs::write(&path_buf, content)
            .map_err(|e| format!("Failed to save note: {}", e))?;
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet, 
            get_downloads_folder, 
            read_folder, 
            open_file, 
            delete_file, 
            create_folder,
            list_notes,
            create_note,
            read_note,
            update_note,
            delete_note,
            rename_note,
            download_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
