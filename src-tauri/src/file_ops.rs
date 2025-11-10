use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct FileItem {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: Option<String>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn get_downloads_folder() -> Result<String, String> {
    dirs::download_dir()
        .ok_or_else(|| "Could not find downloads folder".to_string())
        .and_then(|path| {
            path.to_str()
                .ok_or_else(|| "Invalid path".to_string())
                .map(|s| s.to_string())
        })
}

#[tauri::command]
pub fn read_folder(folder_path: String) -> Result<Vec<FileItem>, String> {
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
pub fn open_file(file_path: String) -> Result<(), String> {
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
pub fn delete_file(file_path: String) -> Result<(), String> {
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
pub fn create_folder(folder_path: String) -> Result<(), String> {
    let path = PathBuf::from(&folder_path);
    
    fs::create_dir_all(&path)
        .map_err(|e| format!("Failed to create folder: {}", e))?;
    
    Ok(())
}
