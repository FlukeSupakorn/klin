import { FolderOpen, ChevronRight, Plus, X } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { WatchingFolder } from '../../store/useHomeStore'

interface WatchingStepProps {
  tempWatchingFolders: WatchingFolder[]
  onAddFolder: () => void
  onRemoveFolder: (id: string) => void
  onBack: () => void
  onNext: () => void
}

export function WatchingStep({
  tempWatchingFolders,
  onAddFolder,
  onRemoveFolder,
  onBack,
  onNext,
}: WatchingStepProps) {
  const getFolderName = (path: string) => {
    const parts = path.split(/[\\/]/)
    return parts[parts.length - 1] || path
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Select Watching Folders</DialogTitle>
        <DialogDescription>
          Choose folders to watch for new files that need organizing. You can add multiple folders.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4 space-y-4">
        {/* Folder List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-theme-text">
              Watching Folders ({tempWatchingFolders.length})
            </label>
            <Button
              type="button"
              size="sm"
              onClick={onAddFolder}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Folder
            </Button>
          </div>

          {tempWatchingFolders.length === 0 ? (
            <div className="border-2 border-dashed border-theme rounded-lg p-8 text-center">
              <FolderOpen className="h-10 w-10 mx-auto mb-2 text-theme-muted" />
              <p className="text-sm text-theme-secondary mb-3">No folders added yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onAddFolder}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Folder
              </Button>
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {tempWatchingFolders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center gap-3 p-3 bg-theme-secondary border border-theme rounded-lg hover:bg-theme-tertiary transition-colors"
                >
                  <div className="flex-shrink-0 p-2 bg-theme-primary-light rounded-lg">
                    <FolderOpen className="h-5 w-5 text-theme-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-theme-text truncate">
                      {folder.name || getFolderName(folder.path)}
                    </p>
                    <p className="text-xs text-theme-muted truncate">{folder.path}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveFolder(folder.id)}
                    className="flex-shrink-0 p-1.5 hover:bg-red-100 dark:hover:bg-red-950/30 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                <li>Add folders where you frequently save downloads</li>
                <li>KLIN will monitor all these folders for new files</li>
                <li>You can add or remove folders later in settings</li>
                <li>Recommended: Start with your Downloads folder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={tempWatchingFolders.length === 0}>
          Next: Choose Setup Mode
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  )
}
