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

export interface EncryptionMetadata {
  encrypted: boolean
  algorithm: string
  message: string
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

// Encryption functions using qpdf
export async function checkQpdfAvailable(): Promise<boolean> {
  try {
    return await invoke<boolean>('check_qpdf_available')
  } catch (error) {
    console.error('Failed to check qpdf availability:', error)
    return false
  }
}

export async function encryptPdf(filePath: string, password: string): Promise<EncryptionMetadata> {
  try {
    return await invoke<EncryptionMetadata>('encrypt_pdf', { filePath, password })
  } catch (error) {
    console.error('Failed to encrypt file:', error)
    throw error
  }
}

export async function decryptPdf(filePath: string, password: string): Promise<EncryptionMetadata> {
  try {
    return await invoke<EncryptionMetadata>('decrypt_pdf', { filePath, password })
  } catch (error) {
    console.error('Failed to decrypt file:', error)
    throw error
  }
}

export async function getEncryptionStatus(filePath: string): Promise<EncryptionMetadata> {
  try {
    return await invoke<EncryptionMetadata>('get_encryption_status', { filePath })
  } catch (error) {
    console.error('Failed to get encryption status:', error)
    throw error
  }
}

export async function checkIsEncrypted(filePath: string): Promise<boolean> {
  try {
    return await invoke<boolean>('check_is_encrypted', { filePath })
  } catch (error) {
    console.error('Failed to check encryption status:', error)
    return false
  }
}
