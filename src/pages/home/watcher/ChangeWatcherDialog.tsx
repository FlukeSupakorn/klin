import { FolderOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useHomeStore } from '../store/useHomeStore'
import { useWatcher } from './useWatcher'

export function ChangeWatcherDialog() {
  const { isChangeFolderOpen, setIsChangeFolderOpen } = useHomeStore()
  const { watchedFolder, handleBrowseChangeFolder } = useWatcher()

  return (
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
            <p
              className="text-sm text-slate-900 font-mono bg-white p-2 rounded border border-slate-200 truncate"
              title={watchedFolder}
            >
              {watchedFolder}
            </p>
          </div>

          <Button onClick={handleBrowseChangeFolder} className="w-full gap-2">
            <FolderOpen className="h-4 w-4" />
            Browse for New Folder
          </Button>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Click the Browse button to select a new folder using your file
              explorer. Files from the new folder will be loaded automatically.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsChangeFolderOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
