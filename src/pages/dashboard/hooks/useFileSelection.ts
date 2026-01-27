import { useState } from 'react'
import { useFileStore } from '@/store/useFileStore'
import { useDashboardStore } from '../store/useDashboardStore'
import { usePrivacyStore } from '@/pages/privacy/store/usePrivacyStore'

export function useFileSelection() {
  const { selectedFileIds, toggleFileSelection, deselectAllFiles, selectAllFiles } = useFileStore()
  const { files } = useDashboardStore()
  const currentViewFolderId = useDashboardStore((state) => state.currentViewFolderId)
  const [localSearch, setLocalSearch] = useState('')
  const shouldExclude = usePrivacyStore((s) => s.shouldExclude)

  // Filter files by current folder if inside a folder, otherwise show nothing (dashboard view)
  // Show ALL files including locked ones (they display with lock icon but can be selected)
  const filesInView = currentViewFolderId
    ? files.filter((file) => file.sourceFolderId === currentViewFolderId)
    : []

  const filteredFiles = filesInView.filter((file) =>
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )

  // All files can be selected now (including locked ones)
  const selectableFiles = filteredFiles

  const selectedFiles = filteredFiles.filter((file) =>
    selectedFileIds.has(file.path)
  )

  // Count locked files for display
  const lockedFilesCount = filteredFiles.filter((file) => shouldExclude(file.path, file.name)).length
  
  // Count how many selected files are locked
  const selectedLockedCount = selectedFiles.filter((file) => shouldExclude(file.path, file.name)).length

  const handleSelectAll = () => {
    // Toggle: if all files are selected, deselect all; otherwise select all
    if (selectedFileIds.size === filteredFiles.length && filteredFiles.length > 0) {
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
    selectedLockedCount,
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
    lockedFilesCount,
    selectableFilesCount: selectableFiles.length,
  }
}
