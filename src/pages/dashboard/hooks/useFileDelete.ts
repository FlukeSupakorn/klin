import { useState } from 'react'
import { FileItem, deleteFile } from '@/lib/tauri-api'
import { useFileStore } from '@/store/useFileStore'
import { useFileLoading } from './useFileLoading'
import { useToast } from '@/components/ui/toast'

export function useFileDelete() {
  const { deselectAllFiles } = useFileStore()
  const { reloadFiles } = useFileLoading()
  const toast = useToast()

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const openDeleteDialog = () => setIsDeleteOpen(true)
  const closeDeleteDialog = () => setIsDeleteOpen(false)

  const handleBulkDelete = async (selectedFiles: FileItem[]) => {
    try {
      setIsDeleting(true)
      
      const fileCount = selectedFiles.length
      
      // Delete all selected files
      for (const file of selectedFiles) {
        await deleteFile(file.path)
      }
      
      // Clear selection after deletion
      deselectAllFiles()
      
      // Reload files after deletion
      await reloadFiles()
      
      setIsDeleteOpen(false)
      
      // Show success toast
      toast.info(
        'Files Deleted',
        `${fileCount} ${fileCount === 1 ? 'file has' : 'files have'} been deleted successfully`
      )
    } catch (error) {
      console.error('Failed to delete files:', error)
      toast.error('Delete Failed', 'An error occurred while deleting files')
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    isDeleteOpen,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleBulkDelete,
  }
}
