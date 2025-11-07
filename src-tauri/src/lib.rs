use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
struct FileItem {
    name: String,
    path: String,
    is_dir: bool,
    size: u64,
    modified: Option<String>,
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_downloads_folder, read_folder])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
