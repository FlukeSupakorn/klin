import { invoke } from '@tauri-apps/api/core'

export interface FileItem {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified?: string
}

export async function getDownloadsFolder(): Promise<string> {
  return await invoke<string>('get_downloads_folder')
}

export async function readFolder(folderPath: string): Promise<FileItem[]> {
  return await invoke<FileItem[]>('read_folder', { folderPath })
}
