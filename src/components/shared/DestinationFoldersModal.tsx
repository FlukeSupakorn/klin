import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FolderListEditor } from './FolderListEditor'
import { selectFolder } from '@/lib/tauri-api'

interface DestinationFoldersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentFolders: string[]
  onSave: (folders: string[]) => void
  title?: string
  description?: string
  minFolders?: number
}

export function DestinationFoldersModal({
  open,
  onOpenChange,
  currentFolders,
  onSave,
  title = 'Configure Destination Folders',
  description = 'Add folders where organized files will be moved.',
  minFolders = 1,
}: DestinationFoldersModalProps) {
  const [tempFolders, setTempFolders] = useState<string[]>(currentFolders)
  const [newFolderPath, setNewFolderPath] = useState('')

  // Reset temp folders when modal opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempFolders(currentFolders)
      setNewFolderPath('')
    }
    onOpenChange(newOpen)
  }

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

  const handleSave = () => {
    onSave(tempFolders)
    onOpenChange(false)
  }

  const canSave = tempFolders.length >= minFolders

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Destination Folders ({tempFolders.length})
          </h3>

          <FolderListEditor
            folders={tempFolders}
            newFolderPath={newFolderPath}
            onNewFolderPathChange={setNewFolderPath}
            onBrowseFolder={handleBrowseFolder}
            onAddFolder={handleAddFolder}
            onRemoveFolder={handleRemoveFolder}
            emptyMessage={`No destination folders yet`}
            placeholder="Enter folder path or browse..."
          />

          {tempFolders.length < minFolders && (
            <p className="text-xs text-amber-600 mt-2">
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
