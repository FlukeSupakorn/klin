import { selectFolder } from '@/lib/tauri-api'
import { useHomeStore } from '../store/useHomeStore'
import { useFileLoading } from '../hooks/useFileLoading'

export function useWatcher() {
  const {
    watchedFolder,
    setWatchedFolder,
    setIsChangeFolderOpen,
  } = useHomeStore()
  const { reloadFiles } = useFileLoading()

  const handleBrowseChangeFolder = async () => {
    const folder = await selectFolder('Select New Watching Folder')
    if (folder) {
      setWatchedFolder(folder)
      await reloadFiles(folder)
      setIsChangeFolderOpen(false)
    }
  }

  return {
    watchedFolder,
    handleBrowseChangeFolder,
  }
}
