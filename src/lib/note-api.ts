import { invoke } from '@tauri-apps/api/core'

export interface NoteItem {
  filename: string
  title: string
  content: string
  created: string
  modified: string
}

export async function listNotes(): Promise<NoteItem[]> {
  return await invoke('list_notes')
}

export async function createNote(title: string, content: string): Promise<string> {
  return await invoke('create_note', { title, content })
}

export async function readNote(filename: string): Promise<string> {
  return await invoke('read_note', { filename })
}

export async function updateNote(filename: string, content: string): Promise<void> {
  return await invoke('update_note', { filename, content })
}

export async function deleteNote(filename: string): Promise<void> {
  return await invoke('delete_note', { filename })
}

export async function renameNote(oldFilename: string, newTitle: string): Promise<string> {
  return await invoke('rename_note', { oldFilename, newTitle })
}

export async function downloadNote(filename: string): Promise<void> {
  return await invoke('download_note', { filename })
}
