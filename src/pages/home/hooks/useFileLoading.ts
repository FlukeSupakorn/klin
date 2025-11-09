import { useEffect } from 'react'
import { getDownloadsFolder, readFolder } from '@/lib/tauri-api'
import { useHomeStore } from '../store/useHomeStore'

export function useFileLoading() {
  const {
    setWatchedFolder,
    setFiles,
    setLoading,
    setIsFirstTimeSetup,
    setTempWatchingFolder,
    setTempDestinations,
    watchedFolder,
  } = useHomeStore()

  useEffect(() => {
    const isFirstTime = localStorage.getItem('klin-first-time-setup') !== 'completed'
    if (isFirstTime) {
      setIsFirstTimeSetup(true)
      loadDefaultFolders()
    } else {
      loadDownloadsFolder()
    }
  }, [])

  const loadDefaultFolders = async () => {
    try {
      const downloadsPath = await getDownloadsFolder()
      setTempWatchingFolder(downloadsPath)
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

  const loadDownloadsFolder = async () => {
    try {
      setLoading(true)
      const downloadsPath = await getDownloadsFolder()
      setWatchedFolder(downloadsPath)
      const files = await readFolder(downloadsPath)
      setFiles(files)
      // Don't set mock destination folders - use what was saved from setup
    } catch (error) {
      console.error('Failed to load downloads folder:', error)
    } finally {
      setLoading(false)
    }
  }

  const reloadFiles = async (folderPath: string) => {
    try {
      setLoading(true)
      const files = await readFolder(folderPath)
      setFiles(files)
    } catch (error) {
      console.error('Failed to reload files:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    reloadFiles,
    watchedFolder,
  }
}
