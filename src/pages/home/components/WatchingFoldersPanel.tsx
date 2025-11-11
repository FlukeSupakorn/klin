import { useHomeStore, WatchingFolder } from '../store/useHomeStore'
import { FolderOpen, Plus, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { selectFolder, readFolder } from '@/lib/tauri-api'
import { generateUUID } from '@/lib/uuid'

export function WatchingFoldersPanel() {
  const watchingFolders = useHomeStore((state) => state.watchingFolders)
  const selectedFolderIds = useHomeStore((state) => state.selectedFolderIds)
  const toggleFolderSelection = useHomeStore((state) => state.toggleFolderSelection)
  const selectAllFolders = useHomeStore((state) => state.selectAllFolders)
  const removeWatchingFolder = useHomeStore((state) => state.removeWatchingFolder)
  const addWatchingFolder = useHomeStore((state) => state.addWatchingFolder)
  const setFiles = useHomeStore((state) => state.setFiles)
  const files = useHomeStore((state) => state.files)

  const isAllSelected = selectedFolderIds.length === 0
  const isFolderSelected = (id: string) => {
    return isAllSelected || selectedFolderIds.includes(id)
  }

  const handleAddFolder = async () => {
    try {
      const folderPath = await selectFolder()
      if (folderPath) {
        // Check for duplicates
        const isDuplicate = watchingFolders.some(f => f.path === folderPath)
        if (isDuplicate) {
          alert('This folder is already being watched!')
          return
        }
        
        const folderName = getFolderName(folderPath)
        
        // Load files from the new folder to get file count
        const folderFiles = await readFolder(folderPath)
        
        const newFolder: WatchingFolder = {
          id: generateUUID(),
          name: folderName,
          path: folderPath,
          fileCount: folderFiles.length,
        }
        
        addWatchingFolder(newFolder)
        
        // Add files from new folder to existing files with source info
        const filesWithSource = folderFiles.map(file => ({
          ...file,
          sourceFolder: folderPath,
          sourceFolderId: newFolder.id,
          sourceFolderName: folderName,
        }))
        
        // If "All" is selected, add new files to the view
        if (selectedFolderIds.length === 0) {
          setFiles([...files, ...filesWithSource])
        }
        
        // Save to localStorage
        saveWatchingFolders([...watchingFolders, newFolder])
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const handleRemoveFolder = (id: string) => {
    removeWatchingFolder(id)
    
    // Remove files from this folder
    const updatedFiles = files.filter(file => file.sourceFolderId !== id)
    setFiles(updatedFiles)
    
    // Save to localStorage
    const updatedFolders = watchingFolders.filter(f => f.id !== id)
    saveWatchingFolders(updatedFolders)
  }

  const saveWatchingFolders = (folders: WatchingFolder[]) => {
    localStorage.setItem('klin-watching-folders', JSON.stringify(folders))
  }

  const getFolderName = (path: string) => {
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1] || path
  }

  if (watchingFolders.length === 0) {
    return (
      <div className="bg-theme-secondary border-2 border-dashed border-theme rounded-lg p-8 text-center">
        <FolderOpen className="h-12 w-12 mx-auto mb-3 text-theme-muted" />
        <h3 className="text-lg font-medium text-theme-text mb-1">
          No watching folders
        </h3>
        <p className="text-sm text-theme-secondary mb-4">
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
        <h2 className="text-lg font-semibold text-theme-text">
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
              className={`relative bg-theme-background border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md group ${
                isSelected
                  ? 'border-theme-primary bg-theme-primary-light'
                  : 'border-theme hover:border-theme-primary'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFolder(folder.id)
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>

              {/* Selected indicator */}
              {isSelected && !isAllSelected && (
                <div className="absolute top-2 left-2">
                  <div className="bg-theme-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}

              {/* Folder icon and info */}
              <div className="flex items-start gap-3 mt-2">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  isSelected ? 'bg-theme-primary-light' : 'bg-theme-tertiary'
                }`}>
                  <FolderOpen className={`h-6 w-6 ${
                    isSelected ? 'text-theme-primary' : 'text-theme-secondary'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium truncate mb-1 ${
                    isSelected ? 'text-theme-primary-dark' : 'text-theme-text'
                  }`}>
                    {folder.name || getFolderName(folder.path)}
                  </h3>
                  <p className="text-xs text-theme-secondary truncate mb-2">
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
    </div>
  )
}
