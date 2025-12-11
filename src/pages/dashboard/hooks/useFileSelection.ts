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

  // Filter files by current folder if inside a folder, otherwise show empty
  // Show ALL files including locked ones (they display with lock icon but can't be selected)
  const filesInView = currentViewFolderId
    ? files.filter((file) => file.sourceFolderId === currentViewFolderId)
    : []

  const filteredFiles = filesInView.filter((file) =>
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )

  // Only non-locked files can be selected
  const selectableFiles = filteredFiles.filter((file) => !shouldExclude(file.path, file.name))

  const selectedFiles = selectableFiles.filter((file) =>
    selectedFileIds.has(file.path)
  )

  // Count locked files for display
  const lockedFilesCount = filteredFiles.filter((file) => shouldExclude(file.path, file.name)).length

  const handleSelectAll = () => {
    // Only select non-locked files
    if (selectedFileIds.size === selectableFiles.length && selectableFiles.length > 0) {
      deselectAllFiles()
    } else {
      const allFileIds = selectableFiles.map((file) => file.path)
      selectAllFiles(allFileIds)
    }
  }

  const isAllSelected = selectableFiles.length > 0 && selectedFileIds.size === selectableFiles.length

  return {
    localSearch,
    setLocalSearch,
    filteredFiles,
    selectedFiles,
    selectedFileIds: Array.from(selectedFileIds), // Convert Set to Array for components
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
    lockedFilesCount,
    selectableFilesCount: selectableFiles.length,
  }
}
