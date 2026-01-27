use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EncryptionMetadata {
    pub encrypted: bool,
    pub algorithm: String,
    pub message: String,
}

/// Get the path to the qpdf executable (bundled sidecar)
fn get_qpdf_path() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        PathBuf::from("./bin/qpdf.exe")
    }
    
    #[cfg(target_os = "macos")]
    {
        PathBuf::from("./bin/qpdf")
    }
    
    #[cfg(target_os = "linux")]
    {
        PathBuf::from("./bin/qpdf")
    }
}

/// Try to find qpdf in common locations
fn find_qpdf_in_system() -> Option<PathBuf> {
    #[cfg(target_os = "windows")]
    {
        // Common Windows installation paths (including version-specific)
        let common_paths = vec![
            PathBuf::from("C:\\Program Files\\qpdf\\bin\\qpdf.exe"),
            PathBuf::from("C:\\Program Files (x86)\\qpdf\\bin\\qpdf.exe"),
            // qpdf with version number (e.g., qpdf 12.2.0)
            PathBuf::from("C:\\Program Files\\qpdf 12.2.0\\bin\\qpdf.exe"),
            PathBuf::from("C:\\Program Files\\qpdf 11.9.0\\bin\\qpdf.exe"),
            PathBuf::from("C:\\Program Files\\qpdf 11.8.0\\bin\\qpdf.exe"),
        ];
        
        for path in common_paths {
            if path.exists() {
                return Some(path);
            }
        }
        
        // Try a more generic search if we still haven't found it
        if let Ok(entries) = std::fs::read_dir("C:\\Program Files") {
            for entry in entries.flatten() {
                let path = entry.path();
                if let Some(name) = path.file_name() {
                    if let Some(name_str) = name.to_str() {
                        if name_str.starts_with("qpdf") {
                            let qpdf_exe = path.join("bin").join("qpdf.exe");
                            if qpdf_exe.exists() {
                                return Some(qpdf_exe);
                            }
                        }
                    }
                }
            }
        }
        
        None
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        // Unix-like systems - check /usr/local/bin, /usr/bin, and homebrew
        for path in &["/usr/local/bin/qpdf", "/usr/bin/qpdf", "/opt/homebrew/bin/qpdf"] {
            let pb = PathBuf::from(path);
            if pb.exists() {
                return Some(pb);
            }
        }
        None
    }
}

/// Check if qpdf is available (bundled or system)
fn is_qpdf_available() -> bool {
    let qpdf_path = get_qpdf_path();
    
    // Try bundled qpdf first
    if qpdf_path.exists() {
        return Command::new(&qpdf_path)
            .arg("--version")
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false);
    }
    
    // Try system PATH
    if Command::new("qpdf")
        .arg("--version")
        .output()
        .map(|output| output.status.success())
        .unwrap_or(false)
    {
        return true;
    }
    
    // Try common installation paths
    if let Some(qpdf_path) = find_qpdf_in_system() {
        return Command::new(&qpdf_path)
            .arg("--version")
            .output()
            .map(|output| output.status.success())
            .unwrap_or(false);
    }
    
    false
}

/// Get the qpdf command (bundled or system)
fn get_qpdf_command() -> Command {
    let qpdf_path = get_qpdf_path();
    
    // Try bundled qpdf first
    if qpdf_path.exists() {
        return Command::new(&qpdf_path);
    }
    
    // Try common system paths
    if let Some(qpdf_path) = find_qpdf_in_system() {
        return Command::new(&qpdf_path);
    }
    
    // Fall back to system PATH
    Command::new("qpdf")
}

/// Encrypt a PDF file with a password using qpdf
#[tauri::command]
pub fn encrypt_pdf(file_path: String, password: String) -> Result<EncryptionMetadata, String> {
    let path = PathBuf::from(&file_path);

    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    if !file_path.to_lowercase().ends_with(".pdf") {
        return Err("Only PDF files can be encrypted".to_string());
    }

    if !is_qpdf_available() {
        return Err("QPDF_NOT_INSTALLED".to_string());
    }

    // Create backup
    let backup_path = format!("{}.backup", file_path);
    fs::copy(&file_path, &backup_path)
        .map_err(|e| format!("Failed to create backup: {}", e))?;

    let temp_output = format!("{}.encrypted.tmp", file_path);

    let status = get_qpdf_command()
        .args(&[
            "--encrypt",
            &password,
            &password,
            "256",
            "--",
            &file_path,
            &temp_output,
        ])
        .status()
        .map_err(|e| format!("Failed to run qpdf: {}", e))?;

    if !status.success() {
        let _ = fs::copy(&backup_path, &file_path);
        return Err("Encryption failed".to_string());
    }

    fs::rename(&temp_output, &file_path)
        .map_err(|e| format!("Failed to replace file: {}", e))?;

    Ok(EncryptionMetadata {
        encrypted: true,
        algorithm: "AES-256".to_string(),
        message: "PDF encrypted successfully".to_string(),
    })
}

/// Decrypt a PDF file
#[tauri::command]
pub fn decrypt_pdf(file_path: String, password: String) -> Result<EncryptionMetadata, String> {
    let path = PathBuf::from(&file_path);

    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    if !is_qpdf_available() {
        return Err("QPDF_NOT_INSTALLED".to_string());
    }

    // Create backup
    let backup_path = format!("{}.backup", file_path);
    fs::copy(&file_path, &backup_path)
        .map_err(|e| format!("Failed to create backup: {}", e))?;

    let temp_output = format!("{}.decrypted.tmp", file_path);

    let status = get_qpdf_command()
        .args(&[
            &format!("--password={}", password),
            "--decrypt",
            "--",
            &file_path,
            &temp_output,
        ])
        .status()
        .map_err(|e| format!("Failed to run qpdf: {}", e))?;

    if !status.success() {
        let _ = fs::copy(&backup_path, &file_path);
        return Err("Decryption failed - wrong password or corrupted file".to_string());
    }

    fs::rename(&temp_output, &file_path)
        .map_err(|e| format!("Failed to replace file: {}", e))?;

    Ok(EncryptionMetadata {
        encrypted: false,
        algorithm: "None".to_string(),
        message: "PDF decrypted successfully".to_string(),
    })
}

/// Check if a PDF file is encrypted
#[tauri::command]
pub fn check_is_encrypted(file_path: String) -> Result<bool, String> {
    let path = PathBuf::from(&file_path);

    if !path.exists() {
        return Err("File does not exist".to_string());
    }

    if !is_qpdf_available() {
        return Ok(false);
    }

    let output = get_qpdf_command()
        .args(&["--is-encrypted", &file_path])
        .output()
        .map_err(|e| format!("Failed to run qpdf: {}", e))?;

    Ok(output.status.success())
}

/// Get encryption status of a file
#[tauri::command]
pub fn get_encryption_status(file_path: String) -> Result<EncryptionMetadata, String> {
    match check_is_encrypted(file_path) {
        Ok(encrypted) => {
            Ok(EncryptionMetadata {
                encrypted,
                algorithm: if encrypted { "AES-256".to_string() } else { "None".to_string() },
                message: if encrypted {
                    "File is encrypted with password protection".to_string()
                } else {
                    "File is not encrypted".to_string()
                },
            })
        }
        Err(e) => Err(e),
    }
}

/// Check if qpdf is available
#[tauri::command]
pub fn check_qpdf_available() -> Result<bool, String> {
    Ok(is_qpdf_available())
}

