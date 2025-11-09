import { useEffect } from 'react'
import { getDownloadsFolder, readFolder, FileItem } from '@/lib/tauri-api'
import { useHomeStore } from '../store/useHomeStore'
import { generateUUID } from '@/lib/uuid'

export function useFileLoading() {
  const {
    watchingFolders,
    selectedFolderIds,
    setFiles,
    setLoading,
    setIsFirstTimeSetup,
    addTempWatchingFolder,
    setTempWatchingFolders,
    setTempDestinations,
    updateWatchingFolder,
    setWatchingFolders,
  } = useHomeStore()

  useEffect(() => {
    const isFirstTime = localStorage.getItem('klin-first-time-setup') !== 'completed'
    if (isFirstTime) {
      setIsFirstTimeSetup(true)
      // Clear temp folders before loading defaults
      setTempWatchingFolders([])
      setFiles([])
      loadDefaultFolders()
    } else {
      loadSavedWatchingFolders()
    }
  }, [])

  // Reload files when selection changes (but not on initial mount)
  useEffect(() => {
    const isFirstTime = localStorage.getItem('klin-first-time-setup') !== 'completed'
    if (!isFirstTime && watchingFolders.length > 0) {
      loadFilesFromSelectedFolders()
    }
  }, [selectedFolderIds])

  const loadDefaultFolders = async () => {
    try {
      const downloadsPath = await getDownloadsFolder()
      const folderName = getFolderName(downloadsPath)
      
      // Add default Downloads folder to temp watching folders
      addTempWatchingFolder({
        id: generateUUID(),
        name: folderName,
        path: downloadsPath,
        fileCount: 0,
      })
      
      setTempDestinations([
        `${downloadsPath}/Documents`,
        `${downloadsPath}/Images`,
        `${downloadsPath}/Videos`,
      ])
      setLoading(false)
    } catch (error) {
      console.error('Failed to load default folders:', error)
      setLoading(false)
    }
  }

  const loadSavedWatchingFolders = async () => {
    try {
      setLoading(true)
      
      // Load watching folders from localStorage
      const savedFolders = localStorage.getItem('klin-watching-folders')
      if (savedFolders) {
        const folders = JSON.parse(savedFolders)
        // Set all folders at once to prevent duplicates
        setWatchingFolders(folders)
      }
      
      // Load files from all watching folders
      await loadFilesFromSelectedFolders()
    } catch (error) {
      console.error('Failed to load saved watching folders:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilesFromSelectedFolders = async () => {
    try {
      setLoading(true)
      
      // Determine which folders to load from
      const foldersToLoad = selectedFolderIds.length === 0
        ? watchingFolders // All folders
        : watchingFolders.filter(f => selectedFolderIds.includes(f.id))
      
      if (foldersToLoad.length === 0) {
        setFiles([])
        return
      }
      
      // Load files from each folder
      const allFiles: FileItem[] = []
      for (const folder of foldersToLoad) {
        try {
          const files = await readFolder(folder.path)
          // Add source folder info to each file
          const filesWithSource = files.map(file => ({
            ...file,
            sourceFolder: folder.path,
            sourceFolderId: folder.id,
            sourceFolderName: folder.name,
          }))
          allFiles.push(...filesWithSource)
          
          // Update file count for this folder
          updateWatchingFolder(folder.id, { fileCount: files.length })
        } catch (error) {
          console.error(`Failed to load files from ${folder.path}:`, error)
        }
      }
      
      setFiles(allFiles)
    } catch (error) {
      console.error('Failed to load files:', error)
    } finally {
      setLoading(false)
    }
  }

  const reloadFiles = async () => {
    await loadFilesFromSelectedFolders()
  }

  const getFolderName = (path: string) => {
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1] || path
  }

  return {
    reloadFiles,
    loadFilesFromSelectedFolders,
  }
}
