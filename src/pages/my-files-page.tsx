import { useState, useEffect } from 'react'
import { Upload, Sparkles, FolderOpen, ChevronRight, Settings, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileIcon } from '@/components/file/file-icon'
import { StorageProgress } from '@/components/file/storage-progress'
import { useFileStore } from '@/store/useFileStore'
import { getDownloadsFolder, readFolder, FileItem } from '@/lib/tauri-api'

export function MyFilesPage() {
  const { selectedFileIds, toggleFileSelection, selectAllFiles, deselectAllFiles, currentView, setCurrentView, storageUsed, storageTotal } = useFileStore()
  const [localSearch, setLocalSearch] = useState('')
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false)
  const [isChangeFolderOpen, setIsChangeFolderOpen] = useState(false)
  const [watchedFolder, setWatchedFolder] = useState<string>('')
  const [realFiles, setRealFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDownloadsFolder()
  }, [])

  const loadDownloadsFolder = async () => {
    try {
      setLoading(true)
      const downloadsPath = await getDownloadsFolder()
      setWatchedFolder(downloadsPath)
      const files = await readFolder(downloadsPath)
      setRealFiles(files)
    } catch (error) {
      console.error('Failed to load downloads folder:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (timestamp?: string): string => {
    if (!timestamp) return 'Unknown'
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getFileType = (name: string, isDir: boolean): 'folder' | 'image' | 'gif' | 'video' | 'document' | 'code' | 'archive' | 'text' => {
    if (isDir) return 'folder'
    const ext = name.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'bmp', 'svg', 'webp'].includes(ext || '')) return 'image'
    if (['gif'].includes(ext || '')) return 'gif'
    if (['mp4', 'avi', 'mov', 'wmv', 'mkv'].includes(ext || '')) return 'video'
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext || '')) return 'document'
    if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'html', 'css', 'rs'].includes(ext || '')) return 'code'
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return 'archive'
    return 'text'
  }
  
  const filteredFiles = realFiles.filter(file => 
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )
  
  const allSelected = selectedFileIds.length === realFiles.length && realFiles.length > 0
  const selectedFiles = realFiles.filter(file => selectedFileIds.includes(file.path))

  const getFolderName = (path: string) => {
    const parts = path.split(/[\/\\]/)
    return parts[parts.length - 1] || 'Downloads'
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span>File Manager</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-indigo-600 font-medium">My Files</span>
            </nav>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900">My Files</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Organize Button with Dialog */}
            <Button variant="outline" className="gap-2" disabled={selectedFileIds.length === 0} onClick={() => setIsOrganizeOpen(true)}>
              <Sparkles className="h-4 w-4" />
              Organize
            </Button>

            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
            
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>

        {/* Folder Watcher Banner */}
        <div className="mt-4">
          <button 
            onClick={() => setIsChangeFolderOpen(true)}
            className="flex items-center gap-3 w-full bg-indigo-50 border border-indigo-200 rounded-lg p-3 hover:bg-indigo-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-indigo-900">Watching Folder</div>
              <div className="text-xs text-indigo-700">{watchedFolder || 'Loading...'}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-indigo-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
          {/* View Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as 'tab' | 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="tab">Tab View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-72">
              <Input 
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Loading files...</p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No files found</p>
              </div>
            </div>
          ) : (
            <>
              {/* List View */}
              {currentView === 'list' && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 text-left w-12">
                          <Checkbox 
                            checked={allSelected}
                            onCheckedChange={() => allSelected ? deselectAllFiles() : selectAllFiles()}
                            aria-label="Select all"
                          />
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                          <div className="flex items-center gap-2">
                            <FileIcon type="folder" className="h-4 w-4" />
                            <span>File Name</span>
                          </div>
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">File Size</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Last Modified</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredFiles.map((file) => {
                        const isSelected = selectedFileIds.includes(file.path)
                        return (
                          <tr 
                            key={file.path} 
                            className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}
                          >
                            <td className="py-4 px-4">
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => toggleFileSelection(file.path)}
                                aria-label={`Select ${file.name}`}
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <FileIcon type={getFileType(file.name, file.is_dir)} className="h-5 w-5 text-indigo-600" />
                                <span className="font-medium text-slate-900">{file.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-slate-600">{formatFileSize(file.size)}</td>
                            <td className="py-4 px-4 text-sm text-slate-600">{formatDate(file.modified)}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <button className="text-sm font-medium text-rose-500 hover:text-rose-600">Delete</button>
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Open</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Grid View */}
              {currentView === 'grid' && (
                <div className="grid grid-cols-4 gap-4">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFileIds.includes(file.path)
                    return (
                      <div 
                        key={file.path}
                        className={`bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : ''}`}
                        onClick={() => toggleFileSelection(file.path)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleFileSelection(file.path)}
                            aria-label={`Select ${file.name}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button className="text-slate-400 hover:text-slate-600">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="h-24 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                          <FileIcon type={getFileType(file.name, file.is_dir)} className="h-12 w-12 text-indigo-600" />
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 mb-1 truncate">{file.name}</h3>
                        <p className="text-sm text-slate-500 mb-3">{formatFileSize(file.size)}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">{formatDate(file.modified)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              
              {/* Tab View */}
              {currentView === 'tab' && (
                <div className="space-y-3">
                  {filteredFiles.map((file) => {
                    const isSelected = selectedFileIds.includes(file.path)
                    return (
                      <div 
                        key={file.path}
                        className={`bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : ''}`}
                        onClick={() => toggleFileSelection(file.path)}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox 
                            checked={isSelected}
                            onCheckedChange={() => toggleFileSelection(file.path)}
                            aria-label={`Select ${file.name}`}
                            onClick={(e) => e.stopPropagation()}
                          />
                          
                          <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileIcon type={getFileType(file.name, file.is_dir)} className="h-6 w-6 text-indigo-600" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{file.name}</h3>
                            <p className="text-sm text-slate-500">{formatFileSize(file.size)} • {formatDate(file.modified)}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="text-sm font-medium text-rose-500 hover:text-rose-600 px-3 py-1">Delete</button>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1">Open</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Storage Progress */}
        <div className="mt-6">
          <StorageProgress used={storageUsed} total={storageTotal} />
        </div>
      </div>

      {/* Organize Dialog */}
      <Dialog open={isOrganizeOpen} onOpenChange={setIsOrganizeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Organize Files
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Do you want to organize these selected files?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-slate-700">Selected files ({selectedFiles.length}):</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <div key={file.path} className="flex items-center gap-3 bg-white rounded-md p-2 border border-slate-200">
                    <FileIcon type={getFileType(file.name, file.is_dir)} className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm text-slate-900">{file.name}</span>
                    <span className="text-xs text-slate-500 ml-auto">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrganizeOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsOrganizeOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Folder Dialog */}
      <Dialog open={isChangeFolderOpen} onOpenChange={setIsChangeFolderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="h-5 w-5 text-indigo-600" />
              Change Watched Folder
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Select a folder to watch for file changes
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Currently watching:</p>
              <p className="text-sm text-slate-900 font-mono bg-white p-2 rounded border border-slate-200">{watchedFolder}</p>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Folder selection feature will be available in the next update. For now, the app watches your Downloads folder.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsChangeFolderOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
