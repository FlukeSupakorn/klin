import { useState, useMemo } from 'react'
import { selectFolder, readFolder, createFolder } from '@/lib/tauri-api'
import { useHomeStore } from '../store/useHomeStore'

// Mock AI-generated folder structure
const generateAIFolders = (watchingFolder: string) => {
  return [
    { name: 'Documents', path: `${watchingFolder}/Organized/Documents`, description: 'PDF, DOCX, TXT files' },
    { name: 'Images', path: `${watchingFolder}/Organized/Images`, description: 'JPG, PNG, GIF files' },
    { name: 'Videos', path: `${watchingFolder}/Organized/Videos`, description: 'MP4, AVI, MOV files' },
    { name: 'Music', path: `${watchingFolder}/Organized/Music`, description: 'MP3, WAV, FLAC files' },
    { name: 'Archives', path: `${watchingFolder}/Organized/Archives`, description: 'ZIP, RAR, 7Z files' },
    { name: 'Applications', path: `${watchingFolder}/Organized/Applications`, description: 'EXE, MSI, DMG files' },
  ]
}

export function useOnboarding() {
  const {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolder,
    tempDestinations,
    destinationMode,
    setIsFirstTimeSetup,
    setSetupStep,
    setTempWatchingFolder,
    setDestinationMode,
    addTempDestination,
    removeTempDestination,
    setWatchedFolder,
    setDestinationFolders,
    setFiles,
    setLoading,
  } = useHomeStore()

  const [tempNewDestination, setTempNewDestination] = useState('')

  // Generate AI folders based on watching folder
  const aiGeneratedFolders = useMemo(
    () => generateAIFolders(tempWatchingFolder),
    [tempWatchingFolder]
  )

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

  const completeAISetup = async () => {
    try {
      setLoading(true)
      
      // Create all AI-generated folders
      const aiFolderPaths = aiGeneratedFolders.map(folder => folder.path)
      for (const folderPath of aiFolderPaths) {
        await createFolder(folderPath)
      }
      
      // Save to store
      setWatchedFolder(tempWatchingFolder)
      setDestinationFolders(aiFolderPaths)

      localStorage.setItem('klin-first-time-setup', 'completed')
      setIsFirstTimeSetup(false)

      // Load files from watching folder
      const files = await readFolder(tempWatchingFolder)
      setFiles(files)
    } catch (error) {
      console.error('Failed to create AI folders:', error)
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
    destinationMode,
    aiGeneratedFolders,
    setTempNewDestination,
    setSetupStep,
    setDestinationMode,
    handleBrowseWatchingFolder,
    handleBrowseDestinationFolder,
    handleAddTempDestination,
    addTempDestination,
    removeTempDestination,
    completeFirstTimeSetup,
    completeAISetup,
  }
}
