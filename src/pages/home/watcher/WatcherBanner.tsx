import { FolderOpen, ChevronRight } from 'lucide-react'
import { useHomeStore } from '../store/useHomeStore'
import { useWatcher } from './useWatcher'

export function WatcherBanner() {
  const { setIsChangeFolderOpen } = useHomeStore()
  const { watchedFolder } = useWatcher()

  return (
    <button
      onClick={() => setIsChangeFolderOpen(true)}
      className="flex items-center gap-3 w-full bg-indigo-50 border border-indigo-200 rounded-lg p-3 hover:bg-indigo-100 transition-colors"
    >
      <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
        <FolderOpen className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium text-indigo-900">Watching Folder</div>
        <div className="text-xs text-indigo-700 truncate" title={watchedFolder}>
          {watchedFolder || 'Loading...'}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-indigo-600 flex-shrink-0" />
    </button>
  )
}
