import { useState } from 'react'
import { selectFolder, readFolder } from '@/lib/tauri-api'
import { useHomeStore } from '../store/useHomeStore'

export function useOnboarding() {
  const {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolder,
    tempDestinations,
    setIsFirstTimeSetup,
    setSetupStep,
    setTempWatchingFolder,
    addTempDestination,
    removeTempDestination,
    setWatchedFolder,
    setDestinationFolders,
    setFiles,
    setLoading,
  } = useHomeStore()

  const [tempNewDestination, setTempNewDestination] = useState('')

  const handleBrowseWatchingFolder = async () => {
    console.log('Browse button clicked - opening folder picker...')
    try {
      const folder = await selectFolder('Select Folder to Watch')
      console.log('Folder selected:', folder)
      if (folder) {
        setTempWatchingFolder(folder)
      }
    } catch (error) {
      console.error('Error selecting folder:', error)
    }
  }

  const handleBrowseDestinationFolder = async () => {
    const folder = await selectFolder('Select Destination Folder')
    if (folder) {
      setTempNewDestination(folder)
    }
  }

  const handleAddTempDestination = () => {
    if (tempNewDestination.trim()) {
      addTempDestination(tempNewDestination.trim())
      setTempNewDestination('')
    }
  }

  const completeFirstTimeSetup = async () => {
    setWatchedFolder(tempWatchingFolder)
    setDestinationFolders(tempDestinations)

    localStorage.setItem('klin-first-time-setup', 'completed')
    setIsFirstTimeSetup(false)

    try {
      setLoading(true)
      const files = await readFolder(tempWatchingFolder)
      setFiles(files)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolder,
    tempDestinations,
    tempNewDestination,
    setTempNewDestination,
    setSetupStep,
    handleBrowseWatchingFolder,
    handleBrowseDestinationFolder,
    handleAddTempDestination,
    removeTempDestination,
    completeFirstTimeSetup,
  }
}
