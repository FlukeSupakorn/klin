import { useState } from 'react'
import { useFileStore } from '@/store/useFileStore'
import { useHomeStore } from '../store/useHomeStore'
import { FileItem } from '@/lib/tauri-api'

export function useFileSelection() {
  const { selectedFileIds, toggleFileSelection, deselectAllFiles } = useFileStore()
  const { files } = useHomeStore()
  const [localSearch, setLocalSearch] = useState('')

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )

  const selectedFiles = filteredFiles.filter((file) =>
    selectedFileIds.includes(file.path)
  )

  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredFiles.length) {
      deselectAllFiles()
    } else {
      const allFileIds = filteredFiles.map((file) => file.path)
      allFileIds.forEach((id) => {
        if (!selectedFileIds.includes(id)) {
          toggleFileSelection(id)
        }
      })
    }
  }

  const isAllSelected = filteredFiles.length > 0 && selectedFileIds.length === filteredFiles.length

  return {
    localSearch,
    setLocalSearch,
    filteredFiles,
    selectedFiles,
    selectedFileIds,
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
  }
}
