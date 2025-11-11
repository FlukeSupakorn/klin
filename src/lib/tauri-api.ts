import { invoke } from '@tauri-apps/api/core'
import { open } from '@tauri-apps/plugin-dialog'

export interface FileItem {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified?: string
  // Extended properties for multiple watching folders
  sourceFolder?: string
  sourceFolderId?: string
  sourceFolderName?: string
}

export async function getDownloadsFolder(): Promise<string> {
  return await invoke<string>('get_downloads_folder')
}

export async function readFolder(folderPath: string): Promise<FileItem[]> {
  return await invoke<FileItem[]>('read_folder', { folderPath })
}

export async function selectFolder(title: string = 'Select Folder'): Promise<string | null> {
  try {
    const result = await open({
      directory: true,
      multiple: false,
      title: title,
    })
    
    return result as string | null
  } catch (error) {
    console.error('Failed to open folder picker:', error)
    return null
  }
}

export async function openFile(filePath: string): Promise<void> {
  try {
    await invoke('open_file', { filePath })
  } catch (error) {
    console.error('Failed to open file:', error)
    throw error
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await invoke('delete_file', { filePath })
  } catch (error) {
    console.error('Failed to delete file:', error)
    throw error
  }
}

export async function createFolder(folderPath: string): Promise<void> {
  try {
    await invoke('create_folder', { folderPath })
  } catch (error) {
    console.error('Failed to create folder:', error)
    throw error
  }
}

export async function readFileBinary(filePath: string): Promise<Uint8Array> {
  try {
    const data = await invoke<number[]>('read_file_binary', { filePath })
    return new Uint8Array(data)
  } catch (error) {
    console.error('Failed to read binary file:', error)
    throw error
  }
}
