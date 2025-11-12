import { FolderOpen, X, Plus } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DestinationsStepProps {
  tempDestinations: string[]
  tempNewDestination: string
  onSetNewDestination: (value: string) => void
  onBrowseFolder: () => void
  onAddDestination: () => void
  onRemoveDestination: (folder: string) => void
  onBack: () => void
  onComplete: () => void
}

export function DestinationsStep({
  tempDestinations,
  tempNewDestination,
  onSetNewDestination,
  onBrowseFolder,
  onAddDestination,
  onRemoveDestination,
  onBack,
  onComplete,
}: DestinationsStepProps) {
  const isDevMode = localStorage.getItem('klin-dev-mode') === 'true'
  
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Configure Destination Folders</DialogTitle>
        <DialogDescription>
          Add folders where organized files will be moved.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <h3 className="text-sm font-semibold text-theme-text mb-3">
          Destination Folders ({tempDestinations.length})
        </h3>

        {/* Folder List */}
        {tempDestinations.length === 0 ? (
          <div className="bg-theme-secondary border border-theme rounded-lg p-6 text-center mb-4">
            <svg
              className="h-12 w-12 text-theme-muted mx-auto mb-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-sm text-theme-secondary">No destination folders yet</p>
            <p className="text-xs text-theme-muted mt-1">Add at least one folder below</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
            {tempDestinations.map((folder, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-theme-background border border-theme rounded-lg p-3 hover:border-theme-primary transition-colors"
              >
                <div className="h-8 w-8 rounded bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
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
                  <p className="text-sm text-theme-text font-mono truncate" title={folder}>
                    {folder}
                  </p>
                </div>
                <button
                  onClick={() => onRemoveDestination(folder)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-theme-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex-shrink-0"
                  title="Remove folder"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Folder Form */}
        <div className="border-t border-theme pt-4">
          <label className="block text-sm font-medium text-theme-text mb-2">
            Add New Folder
          </label>
          <div className="flex gap-2">
            <Input
              value={tempNewDestination}
              onChange={(e) => onSetNewDestination(e.target.value)}
              placeholder="Enter folder path or browse..."
              className="flex-1 font-mono text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddDestination()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={onBrowseFolder}
              className="gap-2 flex-shrink-0"
            >
              <FolderOpen className="h-4 w-4" />
              Browse
            </Button>
            <Button
              onClick={onAddDestination}
              disabled={!tempNewDestination.trim()}
              className="gap-2 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <p className="text-xs text-theme-muted mt-3">
          We've added some default folders for you. You can add more or remove them.
        </p>
        
        {/* Dev Mode Notice */}
        {isDevMode && (
          <div className="mt-3 bg-theme-primary-light border border-theme-primary rounded-md p-2">
            <p className="text-xs text-theme-secondary">
              <span className="font-semibold">Dev Mode:</span> You can complete setup with 0 folders
            </p>
          </div>
        )}
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!isDevMode && tempDestinations.length === 0}>
          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Complete Setup
        </Button>
      </DialogFooter>
    </>
  )
}
