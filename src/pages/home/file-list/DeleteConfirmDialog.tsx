import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteConfirmDialogProps {
  isOpen: boolean
  fileName: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmDialog({ isOpen, fileName, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">Delete File</DialogTitle>
              <DialogDescription className="mt-1">
                This action cannot be undone
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-slate-600 mb-3">
            Are you sure you want to delete this file?
          </p>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <p className="font-medium text-slate-900 truncate" title={fileName}>
              {fileName}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={onConfirm}
          >
            Delete File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
