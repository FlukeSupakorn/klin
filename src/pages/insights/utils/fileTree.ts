import { invoke } from '@tauri-apps/api/core'
import { FileNode } from '../components/FileTreeNode'

interface FileItem {
  name: string
  path: string
  is_dir: boolean
  size: number
  modified: string | null
}

/**
 * Creates a real file tree structure from a destination folder
 * Uses Tauri to read actual files from the filesystem
 */
export async function createFileTree(rootPath: string): Promise<FileNode> {
  const rootName = rootPath.split(/[\\/]/).pop() || rootPath
  
  try {
    const items = await invoke<FileItem[]>('read_folder', { folderPath: rootPath })
    
    // Recursively build tree for subdirectories
    const children: FileNode[] = await Promise.all(
      items.map(async (item) => {
        if (item.is_dir) {
          // Recursively read subdirectories
          try {
            const subTree = await createFileTree(item.path)
            return subTree
          } catch {
            // If can't read subdirectory, return as empty folder
            return {
              name: item.name,
              path: item.path,
              isDir: true,
              children: [],
            }
          }
        } else {
          return {
            name: item.name,
            path: item.path,
            isDir: false,
          }
        }
      })
    )
    
    return {
      name: rootName,
      path: rootPath,
      isDir: true,
      children,
    }
  } catch (error) {
    console.error('Failed to read folder:', rootPath, error)
    return {
      name: rootName,
      path: rootPath,
      isDir: true,
      children: [],
    }
  }
}
