import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { generateFolderNote } from '@/lib/ai-api'
import { FileNode } from '../components/FileTreeNode'

/**
 * Hook for managing file/folder preview and AI note generation
 */
export function useNotePreview() {
  const [selectedItem, setSelectedItem] = useState<FileNode | null>(null)
  const [notePreview, setNotePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectItem = async (item: FileNode) => {
    setSelectedItem(item)
    setIsLoading(true)
    setNotePreview('')
    
    try {
      if (item.isDir) {
        // For folders, show AI-generated note
        const note = await generateFolderNote(item.path, item.name)
        setNotePreview(note)
      } else {
        // For files, try to read actual file content
        try {
          const content = await invoke<string>('read_file_content', { filePath: item.path })
          
          // Check if it's a text file (can display directly)
          const ext = item.name.split('.').pop()?.toLowerCase()
          const textFormats = ['txt', 'md', 'json', 'xml', 'csv', 'log', 'html', 'css', 'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp', 'h', 'rs', 'go']
          
          if (textFormats.includes(ext || '')) {
            // Display text content directly
            setNotePreview(`# 📄 ${item.name}\n\n**Path:** ${item.path}\n\n---\n\n${content}`)
          } else {
            // For binary files, show file info and preview not available
            setNotePreview(`# 📄 ${item.name}\n\n**Path:** ${item.path}\n\n---\n\n## File Preview\n\nThis file type requires external viewer.\n\n**File Extension:** ${ext}\n**Content Length:** ${content.length} bytes\n\n### Actions\n\n- Use your system's default application to open this file\n- Supported formats: PDF, Excel, Word, Images, Videos, etc.\n\n*Click to open with default application*`)
          }
        } catch (error) {
          // If can't read file, show error message
          console.error('Failed to read file:', error)
          setNotePreview(`# ⚠️ Unable to Read File\n\n**File:** ${item.name}\n**Path:** ${item.path}\n\n---\n\n## Error\n\nCould not read file content. This file may be:\n- Binary format (image, video, application)\n- Locked or in use by another application\n- Access restricted\n\n### Recommendation\n\nTry opening the file with your system's default application.`)
        }
      }
    } catch (error) {
      console.error('Failed to load preview:', error)
      setNotePreview('Failed to generate preview.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectedItem,
    notePreview,
    isLoading,
    onSelectItem: handleSelectItem,
  }
}
