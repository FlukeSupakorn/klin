import { useState, useMemo } from 'react'
import { selectFolder, readFolder, createFolder } from '@/lib/tauri-api'
import { useHomeStore, WatchingFolder } from '../store/useHomeStore'
import { generateUUID } from '@/lib/uuid'

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
    tempWatchingFolders,
    tempWatchingFolder, // Legacy
    tempDestinations,
    destinationMode,
    setIsFirstTimeSetup,
    setSetupStep,
    addTempWatchingFolder,
    removeTempWatchingFolder,
    setTempWatchingFolder, // Legacy
    setDestinationMode,
    addTempDestination,
    removeTempDestination,
    addWatchingFolder,
    setDestinationFolders,
    setFiles,
    setLoading,
  } = useHomeStore()

  const [tempNewDestination, setTempNewDestination] = useState('')

  const getFolderName = (path: string) => {
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1] || path
  }

  // Generate AI folders based on first watching folder (legacy behavior)
  const aiGeneratedFolders = useMemo(
    () => {
      const basePath = tempWatchingFolders[0]?.path || tempWatchingFolder
      return basePath ? generateAIFolders(basePath) : []
    },
    [tempWatchingFolders, tempWatchingFolder]
  )

  const handleBrowseWatchingFolder = async () => {
    console.log('Browse button clicked - opening folder picker...')
    try {
      const folder = await selectFolder('Select Folder to Watch')
      console.log('Folder selected:', folder)
      if (folder) {
        const newWatchingFolder: WatchingFolder = {
          id: generateUUID(),
          name: getFolderName(folder),
          path: folder,
          fileCount: 0,
        }
        addTempWatchingFolder(newWatchingFolder)
        // Also update legacy field for backward compatibility
        if (tempWatchingFolders.length === 0) {
          setTempWatchingFolder(folder)
        }
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
    // Save all watching folders to the store
    tempWatchingFolders.forEach((folder) => {
      addWatchingFolder(folder)
    })
    
    setDestinationFolders(tempDestinations)

    localStorage.setItem('klin-first-time-setup', 'completed')
    setIsFirstTimeSetup(false)

    // Load files from all watching folders
    try {
      setLoading(true)
      const allFiles = []
      for (const folder of tempWatchingFolders) {
        const files = await readFolder(folder.path)
        allFiles.push(...files)
      }
      setFiles(allFiles)
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
      
      // Save watching folders to store
      tempWatchingFolders.forEach((folder) => {
        addWatchingFolder(folder)
      })
      
      setDestinationFolders(aiFolderPaths)

      localStorage.setItem('klin-first-time-setup', 'completed')
      setIsFirstTimeSetup(false)

      // Load files from all watching folders
      const allFiles = []
      for (const folder of tempWatchingFolders) {
        const files = await readFolder(folder.path)
        allFiles.push(...files)
      }
      setFiles(allFiles)
    } catch (error) {
      console.error('Failed to create AI folders:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    isFirstTimeSetup,
    setupStep,
    tempWatchingFolders,
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
    removeTempWatchingFolder,
    completeFirstTimeSetup,
    completeAISetup,
  }
}
