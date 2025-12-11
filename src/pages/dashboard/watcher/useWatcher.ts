import { selectFolder } from '@/lib/tauri-api'
import { useDashboardStore } from '../store/useDashboardStore'
import { useFileLoading } from '../hooks/useFileLoading'

export function useWatcher() {
  const {
    watchedFolder,
    setWatchedFolder,
    setIsChangeFolderOpen,
  } = useDashboardStore()
  const { reloadFiles } = useFileLoading()

  const handleBrowseChangeFolder = async () => {
    const folder = await selectFolder('Select New Watching Folder')
    if (folder) {
      setWatchedFolder(folder)
      await reloadFiles()
      setIsChangeFolderOpen(false)
    }
  }

  return {
    watchedFolder,
    handleBrowseChangeFolder,
  }
}
