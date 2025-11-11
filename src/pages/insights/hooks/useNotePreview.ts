import { useState } from 'react'
import { generateFolderNote, generateFileNote } from '@/lib/ai-api'
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
        // For files, check if we can preview the actual file content
        // const ext = item.name.split('.').pop()?.toLowerCase()
        
        // TODO: Add real file preview for supported formats
        // For now, show AI-generated note for all files
        const note = await generateFileNote(item.path, item.name)
        setNotePreview(note)
        
        // Future: Handle different file types
        // if (ext === 'pdf') { /* Use PDF viewer */ }
        // if (ext === 'xlsx' || ext === 'xls') { /* Use Excel viewer */ }
        // if (ext === 'docx' || ext === 'doc') { /* Use Word viewer */ }
        // if (ext === 'txt' || ext === 'md') { /* Use text viewer */ }
      }
    } catch (error) {
      console.error('Failed to load note:', error)
      setNotePreview('Failed to generate preview note.')
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
