import { useHomeStore, WatchingFolder } from '../store/useHomeStore'
import { FolderOpen, Plus, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { selectFolder } from '@/lib/tauri-api'
import { generateUUID } from '@/lib/uuid'

export function WatchingFoldersPanel() {
  const watchingFolders = useHomeStore((state) => state.watchingFolders)
  const selectedFolderIds = useHomeStore((state) => state.selectedFolderIds)
  const toggleFolderSelection = useHomeStore((state) => state.toggleFolderSelection)
  const selectAllFolders = useHomeStore((state) => state.selectAllFolders)
  const removeWatchingFolder = useHomeStore((state) => state.removeWatchingFolder)
  const addWatchingFolder = useHomeStore((state) => state.addWatchingFolder)

  const isAllSelected = selectedFolderIds.length === 0
  const isFolderSelected = (id: string) => {
    return isAllSelected || selectedFolderIds.includes(id)
  }

  const handleAddFolder = async () => {
    try {
      const folderPath = await selectFolder()
      if (folderPath) {
        const folderName = getFolderName(folderPath)
        const newFolder: WatchingFolder = {
          id: generateUUID(),
          name: folderName,
          path: folderPath,
          fileCount: 0, // Will be updated when files are loaded
        }
        addWatchingFolder(newFolder)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const getFolderName = (path: string) => {
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1] || path
  }

  if (watchingFolders.length === 0) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <FolderOpen className="h-12 w-12 mx-auto mb-3 text-slate-400" />
        <h3 className="text-lg font-medium text-slate-900 mb-1">
          No watching folders
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Add folders to watch for automatic organization
        </p>
        <Button onClick={handleAddFolder} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Watching Folder
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Watching Folders ({watchingFolders.length})
        </h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isAllSelected ? 'default' : 'outline'}
            onClick={selectAllFolders}
            className="gap-2"
          >
            {isAllSelected && <Check className="h-4 w-4" />}
            All Folders
          </Button>
          <Button onClick={handleAddFolder} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Folder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {watchingFolders.map((folder) => {
          const isSelected = isFolderSelected(folder.id)
          return (
            <div
              key={folder.id}
              onClick={() => toggleFolderSelection(folder.id)}
              className={`relative bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md group ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeWatchingFolder(folder.id)
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>

              {/* Selected indicator */}
              {isSelected && !isAllSelected && (
                <div className="absolute top-2 left-2">
                  <div className="bg-indigo-600 rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}

              {/* Folder icon and info */}
              <div className="flex items-start gap-3 mt-2">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  isSelected ? 'bg-indigo-100' : 'bg-slate-100'
                }`}>
                  <FolderOpen className={`h-6 w-6 ${
                    isSelected ? 'text-indigo-600' : 'text-slate-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate mb-1 ${
                    isSelected ? 'text-indigo-900' : 'text-slate-900'
                  }`}>
                    {folder.name || getFolderName(folder.path)}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mb-2">
                    {folder.path}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {folder.fileCount} files
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Selection info */}
      <div className="text-sm text-slate-600">
        {isAllSelected ? (
          <p>Viewing files from <strong>all folders</strong></p>
        ) : selectedFolderIds.length === 1 ? (
          <p>Viewing files from <strong>1 folder</strong></p>
        ) : (
          <p>Viewing files from <strong>{selectedFolderIds.length} folders</strong></p>
        )}
      </div>
    </div>
  )
}
