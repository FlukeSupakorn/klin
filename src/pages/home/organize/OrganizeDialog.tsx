import { Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
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

interface OrganizeDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedFiles: FileItem[]
  onGenerate: () => void
  isLoading: boolean
}

export function OrganizeDialog({
  isOpen,
  onClose,
  selectedFiles,
  onGenerate,
  isLoading,
}: OrganizeDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <p className="text-sm font-medium text-slate-700">
              Selected files ({selectedFiles.length}):
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-3 bg-white rounded-md p-2 border border-slate-200 overflow-hidden"
                >
                  <FileIcon
                    type={getFileType(file.name, file.is_dir)}
                    className="h-4 w-4 text-indigo-600 flex-shrink-0"
                  />
                  <span
                    className="text-sm text-slate-900 truncate flex-1 min-w-0 max-w-[250px]"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Checkbox
                id="auto-move"
                checked={autoMove}
                onCheckedChange={handleAutoMoveChange}
              />
              <label
                htmlFor="auto-move"
                className="flex-1 cursor-pointer select-none"
              >
                <div className="text-sm font-medium text-slate-900">Auto Move Files</div>
                <div className="text-xs text-slate-500">
                  Automatically move files to organized folders
                </div>
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <Checkbox
                id="auto-rename"
                checked={autoRename}
                onCheckedChange={handleAutoRenameChange}
              />
              <label
                htmlFor="auto-rename"
                className="flex-1 cursor-pointer select-none"
              >
                <div className="text-sm font-medium text-slate-900">Auto Rename Files</div>
                <div className="text-xs text-slate-500">
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
          <Button onClick={onGenerate} disabled={isLoading}>
            {isLoading ? (
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
