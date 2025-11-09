import { useState } from 'react'
import { useFileStore } from '@/store/useFileStore'
import { useHomeStore } from '../store/useHomeStore'

export function useFileSelection() {
  const { selectedFileIds, toggleFileSelection, deselectAllFiles, selectAllFiles } = useFileStore()
  const { files } = useHomeStore()
  const [localSearch, setLocalSearch] = useState('')

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )

  const selectedFiles = filteredFiles.filter((file) =>
    selectedFileIds.has(file.path)
  )

  const handleSelectAll = () => {
    if (selectedFileIds.size === filteredFiles.length) {
      deselectAllFiles()
    } else {
      const allFileIds = filteredFiles.map((file) => file.path)
      selectAllFiles(allFileIds)
    }
  }

  const isAllSelected = filteredFiles.length > 0 && selectedFileIds.size === filteredFiles.length

  return {
    localSearch,
    setLocalSearch,
    filteredFiles,
    selectedFiles,
    selectedFileIds: Array.from(selectedFileIds), // Convert Set to Array for components
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
  }
}
