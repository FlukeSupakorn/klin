import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FolderListEditor } from '@/components/shared/FolderListEditor'
import { useHomeStore } from '../store/useHomeStore'
import { useDestinations } from './useDestinations'

export function ManageDestinationsDialog() {
  const { isManageFoldersOpen, setIsManageFoldersOpen } = useHomeStore()
  const {
    destinationFolders,
    newDestinationFolder,
    setNewDestinationFolder,
    handleAddDestination,
    handleBrowseDestination,
    removeDestinationFolder,
  } = useDestinations()

  return (
    <Dialog open={isManageFoldersOpen} onOpenChange={setIsManageFoldersOpen}>
      <DialogContent className="sm:max-w-[600px]">
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
            Manage Destination Folders
          </DialogTitle>
          <DialogDescription>
            Configure multiple destination folders where organized files will be moved.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">
            Current Destinations ({destinationFolders.length})
          </h3>

          <FolderListEditor
            folders={destinationFolders}
            newFolderPath={newDestinationFolder}
            onNewFolderPathChange={setNewDestinationFolder}
            onBrowseFolder={handleBrowseDestination}
            onAddFolder={handleAddDestination}
            onRemoveFolder={removeDestinationFolder}
            emptyMessage="No destination folders configured"
            placeholder="Enter folder path (e.g., C:/Users/Documents/Work)"
          />

          {/* Info Box */}
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
        </div>

        <DialogFooter>
          <Button onClick={() => setIsManageFoldersOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
