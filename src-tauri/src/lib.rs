// Module declarations
mod file_ops;
mod note_ops;

// Re-export commands for easy access
use file_ops::*;
use note_ops::*;

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
