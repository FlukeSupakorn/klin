import { useState } from 'react'
import { generateFolderNote } from '@/lib/ai-api'
import { FileNode } from '../components/FileTreeNode'

/**
 * Hook for managing folder preview and AI note generation
 * Files are opened with system application instead of preview
 */
export function useNotePreview() {
  const [selectedItem, setSelectedItem] = useState<FileNode | null>(null)
  const [notePreview, setNotePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectItem = async (item: FileNode) => {
    // Only handle folder selection - files are opened directly
    if (!item.isDir) {
      return
    }

    setSelectedItem(item)
    setIsLoading(true)
    setNotePreview('')
    
    try {
      // For folders, show AI-generated note
      const note = await generateFolderNote(item.path, item.name)
      setNotePreview(note)
    } catch (error) {
      console.error('Failed to load preview:', error)
      setNotePreview('# ❌ Error\n\nFailed to generate folder preview.')
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
