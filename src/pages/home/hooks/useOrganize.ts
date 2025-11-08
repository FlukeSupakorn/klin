import { useState } from 'react'
import { FileItem } from '@/lib/tauri-api'
import { callOrganizeAPI } from '@/lib/mock-api'
import { useHomeStore } from '../store/useHomeStore'

export function useOrganize() {
  const {
    organizePreviews,
    setOrganizePreviews,
    updatePreviewStatus,
    updatePreviewEdit,
    isLoadingOrganize,
    setIsLoadingOrganize,
    setIsOrganizeOpen,
    setIsPreviewOpen,
    watchedFolder,
  } = useHomeStore()

  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editFolder, setEditFolder] = useState('')

  const generateOrganizePreview = async (selectedFiles: FileItem[]) => {
    setIsLoadingOrganize(true)
    try {
      const response = await callOrganizeAPI({
        action: 'Borganize',
        file_paths: selectedFiles.map((f) => f.path),
      })

      const previews = selectedFiles.map((file) => {
        const result = response.result[file.name]

        return {
          file,
          currentName: file.name,
          newName: result?.rename || file.name,
          currentFolder: watchedFolder,
          destinationFolder: result?.move || watchedFolder,
          status: 'pending' as const,
          summary: result?.summary,
        }
      })

      setOrganizePreviews(previews)
      setIsOrganizeOpen(false)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error('Failed to generate organize preview:', error)
    } finally {
      setIsLoadingOrganize(false)
    }
  }

  const handleApprove = (index: number) => {
    updatePreviewStatus(index, 'approved')
  }

  const handleReject = (index: number) => {
    updatePreviewStatus(index, 'rejected')
  }

  const toggleStatus = (index: number) => {
    const current = organizePreviews[index].status
    const newStatus =
      current === 'approved' ? 'pending' : current === 'pending' ? 'rejected' : 'approved'
    updatePreviewStatus(index, newStatus)
  }

  const handleApproveAll = () => {
    organizePreviews.forEach((_, index) => updatePreviewStatus(index, 'approved'))
  }

  const handleRejectAll = () => {
    organizePreviews.forEach((_, index) => updatePreviewStatus(index, 'rejected'))
  }

  const startEdit = (index: number) => {
    const preview = organizePreviews[index]
    setEditingIndex(index)
    setEditName(preview.newName)
    setEditFolder(preview.destinationFolder)
  }

  const saveEdit = () => {
    if (editingIndex !== null) {
      updatePreviewEdit(editingIndex, editName, editFolder)
      setEditingIndex(null)
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditName('')
    setEditFolder('')
  }

  const confirmOrganize = async () => {
    const approved = organizePreviews.filter((p) => p.status === 'approved')
    console.log('Organizing files:', approved)
    // TODO: Implement actual file organization
    setIsPreviewOpen(false)
    setOrganizePreviews([])
  }

  return {
    organizePreviews,
    isLoadingOrganize,
    editingIndex,
    editName,
    editFolder,
    setEditName,
    setEditFolder,
    generateOrganizePreview,
    handleApprove,
    handleReject,
    toggleStatus,
    handleApproveAll,
    handleRejectAll,
    startEdit,
    saveEdit,
    cancelEdit,
    confirmOrganize,
  }
}
