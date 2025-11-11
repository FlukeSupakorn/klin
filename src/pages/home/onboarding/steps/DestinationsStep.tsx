import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FolderListEditor } from '@/components/shared/FolderListEditor'

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
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Configure Destination Folders</DialogTitle>
        <DialogDescription>
          Add folders where organized files will be moved.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Destination Folders ({tempDestinations.length})
        </h3>

        <FolderListEditor
          folders={tempDestinations}
          newFolderPath={tempNewDestination}
          onNewFolderPathChange={onSetNewDestination}
          onBrowseFolder={onBrowseFolder}
          onAddFolder={onAddDestination}
          onRemoveFolder={onRemoveDestination}
          emptyMessage="No destination folders yet"
          placeholder="Enter folder path"
        />

        <p className="text-xs text-slate-500 mt-3">
          We've added some default folders for you. You can add more or remove them.
        </p>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={tempDestinations.length === 0}>
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
