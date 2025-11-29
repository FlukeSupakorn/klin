import { Sparkles, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { formatFileSize, getFileType } from '../file-list/utils'

type ActionType = 'organize' | 'delete'

interface ConfirmActionDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedFiles: FileItem[]
  onConfirm: () => void
  isLoading: boolean
  actionType: ActionType
}

export function ConfirmActionDialog({
  isOpen,
  onClose,
  selectedFiles,
  onConfirm,
  isLoading,
  actionType,
}: ConfirmActionDialogProps) {
  const isOrganize = actionType === 'organize'
  const isDelete = actionType === 'delete'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {isOrganize && <Sparkles className="h-5 w-5 text-indigo-600" />}
            {isDelete && <Trash2 className="h-5 w-5 text-rose-600" />}
            {isOrganize ? 'Organize Files' : 'Delete Files'}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {isOrganize
              ? 'Do you want to organize these selected files?'
              : 'Are you sure you want to delete these files? This action cannot be undone.'}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {isOrganize && (
            <Button onClick={onConfirm} disabled={isLoading}>
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
                'Generate Preview'
              )}
            </Button>
          )}
          {isDelete && (
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={onConfirm}
              disabled={isLoading}
            >
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
                  Deleting...
                </>
              ) : (
                'Delete Files'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
