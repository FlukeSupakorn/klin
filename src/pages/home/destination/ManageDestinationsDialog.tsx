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
import { Input } from '@/components/ui/input'
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
          {/* Current Destination Folders */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Current Destinations ({destinationFolders.length})
            </h3>

            {destinationFolders.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
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
                      onClick={() => removeDestinationFolder(folder)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
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
                    handleAddDestination()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleBrowseDestination}
                className="gap-2 flex-shrink-0"
              >
                <FolderOpen className="h-4 w-4" />
                Browse
              </Button>
              <Button onClick={handleAddDestination} disabled={!newDestinationFolder.trim()}>
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
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
