import { useDashboardStore, WatchingFolder } from '../store/useDashboardStore'
import { FolderOpen, Plus, X, Check } from 'lucide-react'
import { selectFolder, readFolder } from '@/lib/tauri-api'
import { generateUUID } from '@/lib/uuid'

export function WatchingFoldersPanel() {
  const watchingFolders = useDashboardStore((state) => state.watchingFolders)
  const currentViewFolderId = useDashboardStore((state) => state.currentViewFolderId)
  const setCurrentViewFolderId = useDashboardStore((state) => state.setCurrentViewFolderId)
  const removeWatchingFolder = useDashboardStore((state) => state.removeWatchingFolder)
  const addWatchingFolder = useDashboardStore((state) => state.addWatchingFolder)
  const setFiles = useDashboardStore((state) => state.setFiles)
  const files = useDashboardStore((state) => state.files)

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
        if (currentViewFolderId === '') {
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
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm mb-3">
          <FolderOpen className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">
          No watching folders
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Add folders to watch for automatic organization
        </p>
        <button 
          onClick={handleAddFolder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Watching Folder
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-semibold text-slate-700">
              Watching Folders
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {watchingFolders.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddFolder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        </div>
      </div>

      <div 
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
        style={{ scrollbarWidth: 'thin' }}
      >
        {watchingFolders.map((folder) => {
          return (
            <div
              key={folder.id}
              onClick={() => {
                // Navigate into this folder instead of toggling selection
                setCurrentViewFolderId(folder.id)
              }}
              className={`flex-shrink-0 w-[260px] relative rounded-2xl p-3.5 cursor-pointer transition-all group ${
                currentViewFolderId === folder.id
                  ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
                  : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFolder(folder.id)
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
              >
                <X className="h-3.5 w-3.5 text-red-500" />
              </button>

              {/* Selected indicator */}
              {currentViewFolderId === folder.id && (
                <div className="absolute top-2 left-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-1 shadow-sm">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
              )}

              {/* Folder icon and info */}
              <div className="flex items-start gap-2.5 mt-1">
                <div className={`flex-shrink-0 p-2 rounded-xl ${
                  currentViewFolderId === folder.id
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100' 
                    : 'bg-slate-100'
                }`}>
                  <FolderOpen className={`h-4 w-4 ${
                    currentViewFolderId === folder.id ? 'text-blue-600' : 'text-slate-500'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-semibold truncate mb-1 ${
                    currentViewFolderId === folder.id ? 'text-blue-900' : 'text-slate-800'
                  }`}>
                    {folder.name || getFolderName(folder.path)}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mb-2 font-mono">
                    {folder.path}
                  </p>
                  <div className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-lg ${
                    currentViewFolderId === folder.id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <span>{folder.fileCount}</span>
                    <span className="text-[10px]">files</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
