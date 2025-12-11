import { Sparkles, Folder, FileText, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { formatFileSize, getFileType } from '../file-list/utils'
import { organizeFilesQueue, OrganizeFileResponse } from '@/lib/mock-api'
import { useActivityStore } from '@/pages/activity/store/useActivityStore'
import { useToast } from '@/components/ui/toast'
import { useDashboardStore } from '../store/useDashboardStore'

// Simple UUID generator
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface OrganizeDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedFiles: FileItem[]
  onGenerate: () => void
  isLoading: boolean
  organizeMode: 'all-folders' | 'selected-files'
}

export function OrganizeDialog({
  isOpen,
  onClose,
  selectedFiles,
  organizeMode,
}: OrganizeDialogProps) {
  const navigate = useNavigate()
  const toast = useToast()
  const addToQueue = useActivityStore((state) => state.addToQueue)
  const updateQueueItem = useActivityStore((state) => state.updateQueueItem)
  const setProcessing = useActivityStore((state) => state.setProcessing)
  const setProgress = useActivityStore((state) => state.setProgress)
  
  // Get destination folder from dashboard store
  const destinationFolders = useDashboardStore((state) => state.destinationFolders)
  const watchingFolders = useDashboardStore((state) => state.watchingFolders)
  
  // Get the first destination folder (if any)
  const destinationFolderPath = destinationFolders.length > 0 ? destinationFolders[0] : null
  const destinationFolderName = destinationFolderPath 
    ? destinationFolderPath.split(/[\\/]/).pop() || destinationFolderPath
    : null

  const [isOrganizing, setIsOrganizing] = useState(false)

  // Load saved preferences from localStorage, default to true
  const [autoMove, setAutoMove] = useState(() => {
    const saved = localStorage.getItem('organize-auto-move')
    return saved !== null ? saved === 'true' : true
  })
  
  const [autoRename, setAutoRename] = useState(() => {
    const saved = localStorage.getItem('organize-auto-rename')
    return saved !== null ? saved === 'true' : true
  })

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('organize-auto-move', String(autoMove))
  }, [autoMove])

  useEffect(() => {
    localStorage.setItem('organize-auto-rename', String(autoRename))
  }, [autoRename])

  const handleAutoMoveChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setAutoMove(checked)
    }
  }

  const handleAutoRenameChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      setAutoRename(checked)
    }
  }

  const handleConfirmOrganize = async () => {
    if (selectedFiles.length === 0) return

    // Close the dialog
    onClose()

    // Navigate to activity page
    navigate('/history')

    // Reset cancel flag and set processing state
    useActivityStore.setState({ isCancelled: false })
    setProcessing(true)
    setProgress(0, selectedFiles.length)
    setIsOrganizing(true)

    // Start organizing files with queue
    try {
      const filePaths = selectedFiles.map((file) => file.path)

      await organizeFilesQueue(
        filePaths,
        autoMove,
        autoRename,
        (response: OrganizeFileResponse, current: number, total: number) => {
          // Create unique ID for queue item
          const id = generateId()

          if (response.status === 'processing') {
            // Add to queue as processing
            addToQueue({
              ...response,
              id,
              timestamp: new Date(),
              userAction: 'approved', // Default to approved
            })
          } else if (response.status === 'completed') {
            // Update existing item or add new completed item
            const existingItem = useActivityStore
              .getState()
              .queue.find((item) => item.file_path === response.file_path)

            if (existingItem) {
              updateQueueItem(existingItem.id, response)
              
              // Auto-approve if both auto move and auto rename are enabled
              if (autoMove && autoRename) {
                setTimeout(() => {
                  const store = useActivityStore.getState()
                  store.approveItem(existingItem.id)
                }, 500)
              }
            } else {
              addToQueue({
                ...response,
                id,
                timestamp: new Date(),
                userAction: 'approved', // Default to approved
              })
              
              // Auto-approve if both auto move and auto rename are enabled
              if (autoMove && autoRename) {
                setTimeout(() => {
                  const store = useActivityStore.getState()
                  store.approveItem(id)
                }, 500)
              }
            }

            // Update progress
            setProgress(current, total)
          }
        },
        // Check if user cancelled
        () => useActivityStore.getState().isCancelled
      )

      // Finished processing
      const wasCancelled = useActivityStore.getState().isCancelled
      setProcessing(false)
      setIsOrganizing(false)
      
      // Show success toast if not cancelled
      if (!wasCancelled) {
        toast.success(
          'Processing Complete',
          `All ${selectedFiles.length} files have been organized successfully`
        )
      }
    } catch (error) {
      console.error('Error organizing files:', error)
      setProcessing(false)
      setIsOrganizing(false)
      toast.error('Processing Failed', 'An error occurred while organizing files')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-theme-primary" />
            Organize Files
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Do you want to organize these selected files?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 overflow-hidden">
          {/* Mode Description */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                  {organizeMode === 'all-folders' 
                    ? 'Organize All Watching Folders' 
                    : 'Organize Selected Files'}
                </h4>
                <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                  {organizeMode === 'all-folders'
                    ? 'AI will analyze and organize files from all your watching folders'
                    : `AI will analyze and organize ${selectedFiles.length} selected file${selectedFiles.length !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          {/* Folders/Files to Organize */}
          <div className="bg-theme-secondary rounded-xl p-4 space-y-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-theme-text">
                {organizeMode === 'all-folders' ? 'Folders to Organize' : 'Files to Organize'}
              </span>
              <span className="text-xs font-medium text-theme-primary bg-theme-primary-light px-2 py-1 rounded-full">
                {organizeMode === 'all-folders' 
                  ? `${watchingFolders.length} folders`
                  : `${selectedFiles.length} files`}
              </span>
            </div>

            {organizeMode === 'all-folders' ? (
              // Dashboard: show all folders with file counts
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(() => {
                  const folderGroups = selectedFiles.reduce((acc, file) => {
                    const folderId = file.sourceFolderId || 'unknown'
                    if (!acc[folderId]) {
                      acc[folderId] = { name: file.sourceFolderName || 'Unknown', count: 0 }
                    }
                    acc[folderId].count++
                    return acc
                  }, {} as Record<string, { name: string; count: number }>)
                  return Object.entries(folderGroups).map(([id, folder]) => (
                    <div key={id} className="flex items-center justify-between bg-theme-background rounded-lg px-3 py-2.5 border border-theme">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-theme-text text-sm truncate">{folder.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <FileText className="h-3.5 w-3.5 text-theme-muted" />
                        <span className="text-xs text-theme-secondary whitespace-nowrap">{folder.count} files</span>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            ) : (
              // Selected files: group by source folder
              <div className="space-y-3 max-h-64 overflow-y-auto overflow-x-hidden">
                {(() => {
                  // Group files by source folder
                  const filesByFolder = selectedFiles.reduce((acc, file) => {
                    const folderName = file.sourceFolderName || 'Unknown'
                    if (!acc[folderName]) {
                      acc[folderName] = []
                    }
                    acc[folderName].push(file)
                    return acc
                  }, {} as Record<string, FileItem[]>)

                  return Object.entries(filesByFolder).map(([folderName, files]) => (
                    <div key={folderName} className="bg-theme-background rounded-lg border border-theme overflow-hidden">
                      {/* Folder header */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border-b border-theme">
                        <Folder className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate flex-1 min-w-0">{folderName}</span>
                        <span className="text-xs text-blue-500 dark:text-blue-400 flex-shrink-0 whitespace-nowrap">{files.length} files</span>
                      </div>
                      {/* Files list */}
                      <div className="divide-y divide-theme">
                        {files.map((file) => (
                          <div key={file.path} className="flex items-center gap-3 px-3 py-2">
                            <FileIcon
                              type={getFileType(file.name, file.is_dir)}
                              className="h-4 w-4 text-theme-primary flex-shrink-0"
                            />
                            <span className="text-sm text-theme-text truncate flex-1 min-w-0" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-xs text-theme-muted flex-shrink-0 whitespace-nowrap">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                })()}
              </div>
            )}
          </div>

          {/* Destination Folder Info */}
          {destinationFolderPath && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <Folder className="h-4 w-4 text-theme-muted" />
                  <span className="text-sm text-theme-secondary">Watching Folders</span>
                </div>
                <ArrowRight className="h-4 w-4 text-green-500" />
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">{destinationFolderName}</span>
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Files will be organized into this destination folder
              </p>
            </div>
          )}

          {/* Options */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-theme-background border border-theme rounded-lg hover-bg-theme-secondary transition-colors">
              <Checkbox
                id="auto-move"
                checked={autoMove}
                onCheckedChange={handleAutoMoveChange}
              />
              <label
                htmlFor="auto-move"
                className="flex-1 cursor-pointer select-none"
              >
                <div className="text-sm font-medium text-theme-text">Auto Move Files</div>
                <div className="text-xs text-theme-secondary">
                  Automatically move files to organized folders
                </div>
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-theme-background border border-theme rounded-lg hover-bg-theme-secondary transition-colors">
              <Checkbox
                id="auto-rename"
                checked={autoRename}
                onCheckedChange={handleAutoRenameChange}
              />
              <label
                htmlFor="auto-rename"
                className="flex-1 cursor-pointer select-none"
              >
                <div className="text-sm font-medium text-theme-text">Auto Rename Files</div>
                <div className="text-xs text-theme-secondary">
                  Automatically rename files with descriptive names
                </div>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirmOrganize} disabled={isOrganizing || selectedFiles.length === 0}>
            {isOrganizing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
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
  )
}
