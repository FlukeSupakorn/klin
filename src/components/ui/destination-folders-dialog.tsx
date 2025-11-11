import { useState, useEffect } from 'react'
import { X, Plus, FolderOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { selectFolder } from '@/lib/tauri-api'

interface DestinationFoldersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFolders: string[]
  onSave: (folders: string[]) => void
  title?: string
  description?: string
  minFolders?: number
  showTips?: boolean
}

export function DestinationFoldersDialog({
  open,
  onOpenChange,
  currentFolders,
  onSave,
  title = 'Configure Destination Folders',
  description = 'Add folders where organized files will be moved.',
  minFolders = 1,
  showTips = false,
}: DestinationFoldersDialogProps) {
  const [tempFolders, setTempFolders] = useState<string[]>(currentFolders)
  const [newFolderPath, setNewFolderPath] = useState('')

  // Sync with currentFolders when they change
  useEffect(() => {
    if (open) {
      setTempFolders(currentFolders)
      setNewFolderPath('')
    }
  }, [open, currentFolders])

  const handleBrowseFolder = async () => {
    try {
      const folder = await selectFolder('Select Destination Folder')
      if (folder) {
        setNewFolderPath(folder)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  const handleAddFolder = () => {
    const trimmedPath = newFolderPath.trim()
    if (trimmedPath && !tempFolders.includes(trimmedPath)) {
      setTempFolders([...tempFolders, trimmedPath])
      setNewFolderPath('')
    }
  }

  const handleRemoveFolder = (folder: string) => {
    setTempFolders(tempFolders.filter((f) => f !== folder))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFolderPath.trim()) {
      handleAddFolder()
    }
  }

  const handleSave = () => {
    onSave(tempFolders)
    onOpenChange(false)
  }

  const canSave = tempFolders.length >= minFolders

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <svg
              className="h-5 w-5 text-emerald-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Folder Count */}
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Destination Folders ({tempFolders.length})
          </h3>

          {/* Folder List */}
          {tempFolders.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center mb-4">
              <svg
                className="h-12 w-12 text-slate-400 mx-auto mb-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm text-slate-600">No destination folders yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Add at least {minFolders} folder{minFolders > 1 ? 's' : ''} below
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {tempFolders.map((folder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
                >
                  <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-emerald-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-mono truncate" title={folder}>
                      {folder}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFolder(folder)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                    title="Remove folder"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Folder Form */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Add New Folder
            </label>
            <div className="flex gap-2">
              <Input
                value={newFolderPath}
                onChange={(e) => setNewFolderPath(e.target.value)}
                placeholder="Enter folder path or browse..."
                className="flex-1 font-mono text-sm"
                onKeyPress={handleKeyPress}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseFolder}
                className="gap-2 flex-shrink-0"
              >
                <FolderOpen className="h-4 w-4" />
                Browse
              </Button>
              <Button
                onClick={handleAddFolder}
                disabled={!newFolderPath.trim()}
                className="gap-2 flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Tips Section (optional) */}
          {showTips && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1 ml-4 list-disc">
                    <li>You can add multiple destination folders</li>
                    <li>Files will be organized into these folders based on type or rules</li>
                    <li>Remove folders by clicking the ✕ button</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Validation Message */}
          {tempFolders.length < minFolders && (
            <p className="text-xs text-amber-600 mt-3">
              Please add at least {minFolders} folder{minFolders > 1 ? 's' : ''} to continue.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
