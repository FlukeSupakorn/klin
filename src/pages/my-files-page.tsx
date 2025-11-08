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
import { getDownloadsFolder, readFolder, FileItem, selectFolder } from '@/lib/tauri-api'
import { callOrganizeAPI, FileOrganizeResult } from '@/lib/mock-api'

interface OrganizePreview {
  file: FileItem
  currentName: string
  newName: string
  currentFolder: string
  destinationFolder: string
  status: 'pending' | 'approved' | 'rejected'
  summary?: string
}

export function MyFilesPage() {
  const { selectedFileIds, toggleFileSelection, deselectAllFiles, currentView, setCurrentView, storageUsed, storageTotal } = useFileStore()
  const [localSearch, setLocalSearch] = useState('')
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isChangeFolderOpen, setIsChangeFolderOpen] = useState(false)
  const [isManageFoldersOpen, setIsManageFoldersOpen] = useState(false)
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false)
  const [setupStep, setSetupStep] = useState<'welcome' | 'watching' | 'destinations'>('welcome')
  const [tempWatchingFolder, setTempWatchingFolder] = useState<string>('')
  const [tempDestinations, setTempDestinations] = useState<string[]>([])
  const [tempNewDestination, setTempNewDestination] = useState<string>('')
  const [watchedFolder, setWatchedFolder] = useState<string>('')
  const [destinationFolders, setDestinationFolders] = useState<string[]>([])
  const [newDestinationFolder, setNewDestinationFolder] = useState<string>('')
  const [realFiles, setRealFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingOrganize, setIsLoadingOrganize] = useState(false)
  const [organizePreviews, setOrganizePreviews] = useState<OrganizePreview[]>([])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editFolder, setEditFolder] = useState('')

  useEffect(() => {
    // Check if this is first time opening the app
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
        `${downloadsPath}/Videos`
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
      setRealFiles(files)
      
      // Set mock destination folders (in real app, load from settings)
      setDestinationFolders([
        `${downloadsPath}/Documents`,
        `${downloadsPath}/Images`,
        `${downloadsPath}/Videos`
      ])
    } catch (error) {
      console.error('Failed to load downloads folder:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDestinationFolder = () => {
    if (newDestinationFolder.trim() && !destinationFolders.includes(newDestinationFolder.trim())) {
      setDestinationFolders([...destinationFolders, newDestinationFolder.trim()])
      setNewDestinationFolder('')
    }
  }

  const removeDestinationFolder = (folder: string) => {
    setDestinationFolders(destinationFolders.filter(f => f !== folder))
  }

  const addTempDestination = () => {
    if (tempNewDestination.trim() && !tempDestinations.includes(tempNewDestination.trim())) {
      setTempDestinations([...tempDestinations, tempNewDestination.trim()])
      setTempNewDestination('')
    }
  }

  const removeTempDestination = (folder: string) => {
    setTempDestinations(tempDestinations.filter(f => f !== folder))
  }

  const handleBrowseWatchingFolder = async () => {
    console.log('Browse button clicked - opening folder picker...')
    try {
      const folder = await selectFolder('Select Folder to Watch')
      console.log('Folder selected:', folder)
      if (folder) {
        setTempWatchingFolder(folder)
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

  const handleBrowseChangeFolder = async () => {
    const folder = await selectFolder('Select New Watching Folder')
    if (folder) {
      setWatchedFolder(folder)
      // Reload files from new folder
      try {
        setLoading(true)
        const files = await readFolder(folder)
        setRealFiles(files)
      } catch (error) {
        console.error('Failed to load files:', error)
      } finally {
        setLoading(false)
      }
      setIsChangeFolderOpen(false)
    }
  }

  const handleBrowseManageDestination = async () => {
    const folder = await selectFolder('Add Destination Folder')
    if (folder) {
      setNewDestinationFolder(folder)
    }
  }

  const completeFirstTimeSetup = async () => {
    // Save the configuration
    setWatchedFolder(tempWatchingFolder)
    setDestinationFolders(tempDestinations)
    
    // Mark setup as completed
    localStorage.setItem('klin-first-time-setup', 'completed')
    setIsFirstTimeSetup(false)
    
    // Load files from the selected folder
    try {
      setLoading(true)
      const files = await readFolder(tempWatchingFolder)
      setRealFiles(files)
    } catch (error) {
      console.error('Failed to load files:', error)
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
  
  const selectedFiles = filteredFiles.filter(file => selectedFileIds.includes(file.path))

  const handleSelectAll = () => {
    if (selectedFileIds.length === filteredFiles.length) {
      deselectAllFiles()
    } else {
      const allFileIds = filteredFiles.map(file => file.path)
      allFileIds.forEach(id => {
        if (!selectedFileIds.includes(id)) {
          toggleFileSelection(id)
        }
      })
    }
  }

  const isAllSelected = filteredFiles.length > 0 && selectedFileIds.length === filteredFiles.length

  const getFolderName = (path: string) => {
    const parts = path.split(/[\/\\]/)
    return parts[parts.length - 1] || 'Downloads'
  }

  const generateOrganizePreview = async () => {
    setIsLoadingOrganize(true)
    try {
      // Call the mock API with batch organize
      const response = await callOrganizeAPI({
        action: 'Borganize',
        file_paths: selectedFiles.map(f => f.path)
      })

      // Convert API response to preview format
      const previews: OrganizePreview[] = selectedFiles.map(file => {
        const result = response.result[file.name]
        
        return {
          file,
          currentName: file.name,
          newName: result?.rename || file.name,
          currentFolder: watchedFolder,
          destinationFolder: result?.move || watchedFolder,
          status: 'pending' as const,
          summary: result?.summary
        }
      })
      
      setOrganizePreviews(previews)
      setIsOrganizeOpen(false)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error('Failed to organize files:', error)
      alert('Failed to generate organization preview. Please try again.')
    } finally {
      setIsLoadingOrganize(false)
    }
  }

  const handleApproveAll = () => {
    setOrganizePreviews(prev => prev.map(p => ({ ...p, status: 'approved' })))
  }

  const handleRejectAll = () => {
    setOrganizePreviews(prev => prev.map(p => ({ ...p, status: 'rejected' })))
  }

  const toggleStatus = (index: number) => {
    setOrganizePreviews(prev => prev.map((p, i) => {
      if (i === index) {
        return {
          ...p,
          status: p.status === 'approved' ? 'pending' : p.status === 'pending' ? 'rejected' : 'approved'
        }
      }
      return p
    }))
  }

  const startEdit = (index: number) => {
    setEditingIndex(index)
    setEditName(organizePreviews[index].newName)
    setEditFolder(organizePreviews[index].destinationFolder)
  }

  const saveEdit = () => {
    if (editingIndex !== null) {
      setOrganizePreviews(prev => prev.map((p, i) => {
        if (i === editingIndex) {
          return {
            ...p,
            newName: editName,
            destinationFolder: editFolder
          }
        }
        return p
      }))
      setEditingIndex(null)
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditName('')
    setEditFolder('')
  }

  const handleFinalConfirm = () => {
    const approvedCount = organizePreviews.filter(p => p.status !== 'rejected').length
    
    if (approvedCount === 0) {
      setIsPreviewOpen(false)
      return
    }
    
    // In real app, this would execute the organization
    setIsPreviewOpen(false)
    deselectAllFiles()
  }

  // Show first-time setup modal if needed
  if (isFirstTimeSetup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="sm:max-w-[700px]" onInteractOutside={(e) => e.preventDefault()}>
            {setupStep === 'welcome' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    Welcome to KLIN!
                  </DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Let's get you started with organizing your files automatically.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">What KLIN can do for you:</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Automatically Organize Files</p>
                          <p className="text-sm text-slate-600">Watch folders and organize files by type, date, or custom rules</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">Smart Renaming</p>
                          <p className="text-sm text-slate-600">Rename files with meaningful names based on content analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">AI-Powered Summaries</p>
                          <p className="text-sm text-slate-600">Generate summaries and insights for your documents</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 text-center">
                    This quick setup will take less than a minute. Let's configure your folders!
                  </p>
                </div>

                <DialogFooter>
                  <Button onClick={() => setSetupStep('watching')} className="w-full">
                    Get Started
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            )}

            {setupStep === 'watching' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">Select Watching Folder</DialogTitle>
                  <DialogDescription>
                    Choose a folder to watch for new files that need organizing.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Folder Path
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tempWatchingFolder}
                        onChange={(e) => setTempWatchingFolder(e.target.value)}
                        placeholder="Enter folder path (e.g., C:/Users/Downloads)"
                        className="flex-1 font-mono text-sm"
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={handleBrowseWatchingFolder}
                        className="gap-2 flex-shrink-0"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Default: Your Downloads folder. You can change this later in settings.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
                        <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                          <li>Choose a folder where you frequently save downloads</li>
                          <li>KLIN will monitor this folder for new files</li>
                          <li>Files will be automatically organized based on your rules</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button variant="outline" onClick={() => setSetupStep('welcome')}>
                    Back
                  </Button>
                  <Button onClick={() => setSetupStep('destinations')} disabled={!tempWatchingFolder.trim()}>
                    Next: Destination Folders
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </DialogFooter>
              </>
            )}

            {setupStep === 'destinations' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">Configure Destination Folders</DialogTitle>
                  <DialogDescription>
                    Add folders where organized files will be moved.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Destination Folders ({tempDestinations.length})
                    </h3>
                    
                    {tempDestinations.length === 0 ? (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-4">
                        <svg className="h-12 w-12 text-slate-400 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <p className="text-sm text-slate-600">No destination folders yet</p>
                        <p className="text-xs text-slate-500 mt-1">Add at least one folder below</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                        {tempDestinations.map((folder, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3"
                          >
                            <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <svg className="h-4 w-4 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-900 font-mono truncate" title={folder}>
                                {folder}
                              </p>
                            </div>
                            <button
                              onClick={() => removeTempDestination(folder)}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                            >
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Add New Destination
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={tempNewDestination}
                        onChange={(e) => setTempNewDestination(e.target.value)}
                        placeholder="Enter folder path"
                        className="flex-1 font-mono text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTempDestination()
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={handleBrowseDestinationFolder}
                        className="gap-2 flex-shrink-0"
                      >
                        <FolderOpen className="h-4 w-4" />
                        Browse
                      </Button>
                      <Button onClick={addTempDestination} disabled={!tempNewDestination.trim()}>
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 4v16m8-8H4" />
                        </svg>
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      We've added some default folders for you. You can add more or remove them.
                    </p>
                  </div>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button variant="outline" onClick={() => setSetupStep('watching')}>
                    Back
                  </Button>
                  <Button onClick={completeFirstTimeSetup} disabled={tempDestinations.length === 0}>
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Setup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
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
        <div className="mt-4 space-y-3">
          {/* Watching Folder */}
          <button 
            onClick={() => setIsChangeFolderOpen(true)}
            className="flex items-center gap-3 w-full bg-indigo-50 border border-indigo-200 rounded-lg p-3 hover:bg-indigo-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-indigo-900">Watching Folder</div>
              <div className="text-xs text-indigo-700 truncate" title={watchedFolder}>{watchedFolder || 'Loading...'}</div>
            </div>
            <ChevronRight className="h-5 w-5 text-indigo-600 flex-shrink-0" />
          </button>

          {/* Destination Folders */}
          <button 
            onClick={() => setIsManageFoldersOpen(true)}
            className="flex items-center gap-3 w-full bg-emerald-50 border border-emerald-200 rounded-lg p-3 hover:bg-emerald-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-emerald-900">
                Destination Folders ({destinationFolders.length})
              </div>
              <div className="text-xs text-emerald-700">
                {destinationFolders.length === 0 ? (
                  'No destinations set'
                ) : destinationFolders.length === 1 ? (
                  <span className="truncate block" title={destinationFolders[0]}>{destinationFolders[0]}</span>
                ) : (
                  `${destinationFolders.length} folders configured`
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0" />
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
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
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
                  <div key={file.path} className="flex items-center gap-3 bg-white rounded-md p-2 border border-slate-200 overflow-hidden">
                    <FileIcon type={getFileType(file.name, file.is_dir)} className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                    <span className="text-sm text-slate-900 truncate flex-1 min-w-0 max-w-[250px]" title={file.name}>{file.name}</span>
                    <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">{formatFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrganizeOpen(false)}>Cancel</Button>
            <Button onClick={generateOrganizePreview} disabled={isLoadingOrganize}>
              {isLoadingOrganize ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Organizing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Organize Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Organization Preview
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Review the proposed file organization. You can approve, reject, or edit each file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto py-4">
            <div className="space-y-3">
              {organizePreviews.map((preview, index) => (
                <div 
                  key={preview.file.path}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    preview.status === 'approved' 
                      ? 'border-green-500 bg-green-50' 
                      : preview.status === 'rejected' 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="flex-shrink-0">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        preview.status === 'approved' 
                          ? 'bg-green-100' 
                          : preview.status === 'rejected' 
                          ? 'bg-red-100' 
                          : 'bg-slate-100'
                      }`}>
                        <FileIcon 
                          type={getFileType(preview.file.name, preview.file.is_dir)} 
                          className={`h-6 w-6 ${
                            preview.status === 'approved' 
                              ? 'text-green-600' 
                              : preview.status === 'rejected' 
                              ? 'text-red-600' 
                              : 'text-indigo-600'
                          }`} 
                        />
                      </div>
                    </div>

                    {/* File Details */}
                    <div className="flex-1 min-w-0">
                      {editingIndex === index ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">New Name</label>
                            <Input 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Destination Folder</label>
                            <Input 
                              value={editFolder}
                              onChange={(e) => setEditFolder(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit}>Save</Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {/* Name Change */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs font-medium text-slate-500 mb-1">Current Name</div>
                              <div className="text-sm text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate">
                                {preview.currentName}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-slate-500 mb-1">New Name</div>
                              <div className={`text-sm font-mono px-2 py-1 rounded border truncate ${
                                preview.currentName !== preview.newName 
                                  ? 'text-indigo-900 bg-indigo-50 border-indigo-200 font-semibold' 
                                  : 'text-slate-900 bg-slate-50 border-slate-200'
                              }`}>
                                {preview.newName}
                              </div>
                            </div>
                          </div>

                          {/* Folder Change */}
                          <div>
                            <div className="text-xs font-medium text-slate-500 mb-1">Move To</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 text-xs text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate">
                                {preview.currentFolder}
                              </div>
                              <svg className="h-4 w-4 text-slate-400 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 5l7 7-7 7" />
                              </svg>
                              <div className="flex-1 text-xs text-indigo-900 font-mono bg-indigo-50 px-2 py-1 rounded border border-indigo-200 font-semibold truncate">
                                {preview.destinationFolder}
                              </div>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              preview.status === 'approved' 
                                ? 'bg-green-100 text-green-700' 
                                : preview.status === 'rejected' 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {preview.status === 'approved' && (
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {preview.status === 'rejected' && (
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                              {preview.status === 'pending' && (
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              )}
                              {preview.status.charAt(0).toUpperCase() + preview.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleStatus(index)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          preview.status === 'approved' 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : preview.status === 'rejected' 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-slate-600 text-white hover:bg-slate-700'
                        }`}
                      >
                        {preview.status === 'approved' ? 'Approved' : preview.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </button>
                      {editingIndex !== index && (
                        <button
                          onClick={() => startEdit(index)}
                          className="px-3 py-1 rounded-md text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleApproveAll}>
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Approve All
                </Button>
                <Button variant="outline" size="sm" onClick={handleRejectAll}>
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Reject All
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Cancel</Button>
                <Button onClick={handleFinalConfirm}>
                  Confirm Organization
                </Button>
              </div>
            </div>
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
              Select a new folder to watch for file changes
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-slate-700 mb-2">Currently watching:</p>
              <p className="text-sm text-slate-900 font-mono bg-white p-2 rounded border border-slate-200 truncate" title={watchedFolder}>{watchedFolder}</p>
            </div>
            
            <Button 
              onClick={handleBrowseChangeFolder}
              className="w-full gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              Browse for New Folder
            </Button>
            
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Click the Browse button to select a new folder using your file explorer. Files from the new folder will be loaded automatically.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeFolderOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Destination Folders Dialog */}
      <Dialog open={isManageFoldersOpen} onOpenChange={setIsManageFoldersOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <svg className="h-5 w-5 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              Manage Destination Folders
            </DialogTitle>
            <DialogDescription>
              Configure multiple destination folders where organized files will be moved.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {/* Current Destination Folders */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">
                Current Destinations ({destinationFolders.length})
              </h3>
              
              {destinationFolders.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                  <svg className="h-12 w-12 text-slate-400 mx-auto mb-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p className="text-sm text-slate-600">No destination folders configured</p>
                  <p className="text-xs text-slate-500 mt-1">Add folders below to get started</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {destinationFolders.map((folder, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 hover:border-emerald-300 transition-colors"
                    >
                      <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <svg className="h-4 w-4 text-emerald-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-mono truncate" title={folder}>
                          {folder}
                        </p>
                      </div>
                      <button
                        onClick={() => removeDestinationFolder(folder)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Folder */}
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Add New Destination</h3>
              <div className="flex gap-2">
                <Input
                  value={newDestinationFolder}
                  onChange={(e) => setNewDestinationFolder(e.target.value)}
                  placeholder="Enter folder path (e.g., C:/Users/Documents/Work)"
                  className="flex-1 font-mono text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addDestinationFolder()
                    }
                  }}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleBrowseManageDestination}
                  className="gap-2 flex-shrink-0"
                >
                  <FolderOpen className="h-4 w-4" />
                  Browse
                </Button>
                <Button onClick={addDestinationFolder} disabled={!newDestinationFolder.trim()}>
                  <svg className="h-4 w-4 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Click Browse to select a folder, or enter the path manually.
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">How it works</p>
                  <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                    <li>Files will be automatically organized to these destination folders</li>
                    <li>Each file type can be routed to specific destinations</li>
                    <li>You can add multiple folders for different organization strategies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageFoldersOpen(false)}>Close</Button>
            <Button onClick={() => setIsManageFoldersOpen(false)}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
