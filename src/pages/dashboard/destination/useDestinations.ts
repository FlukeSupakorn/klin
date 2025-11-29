import { useState } from 'react'
import { selectFolder } from '@/lib/tauri-api'
import { useDashboardStore } from '../store/useDashboardStore'

export function useDestinations() {
  const {
    destinationFolders,
    addDestinationFolder,
    removeDestinationFolder,
  } = useDashboardStore()

  const [newDestinationFolder, setNewDestinationFolder] = useState('')

  const handleAddDestination = () => {
    if (newDestinationFolder.trim()) {
      addDestinationFolder(newDestinationFolder.trim())
      setNewDestinationFolder('')
    }
  }

  const handleBrowseDestination = async () => {
    const folder = await selectFolder('Add Destination Folder')
    if (folder) {
      setNewDestinationFolder(folder)
    }
  }

  return {
    destinationFolders,
    newDestinationFolder,
    setNewDestinationFolder,
    handleAddDestination,
    handleBrowseDestination,
    removeDestinationFolder,
  }
}
