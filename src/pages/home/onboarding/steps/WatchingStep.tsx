import { FolderOpen, ChevronRight } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WatchingStepProps {
  tempWatchingFolder: string
  onBrowseFolder: () => void
  onBack: () => void
  onNext: () => void
}

export function WatchingStep({
  tempWatchingFolder,
  onBrowseFolder,
  onBack,
  onNext,
}: WatchingStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Select Watching Folder</DialogTitle>
        <DialogDescription>
          Choose a folder to watch for new files that need organizing.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Folder Path</label>
          <div className="flex gap-2">
            <Input
              value={tempWatchingFolder}
              placeholder="Enter folder path (e.g., C:/Users/Downloads)"
              className="flex-1 font-mono text-sm"
              readOnly
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
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Default: Your Downloads folder. You can change this later in settings.
          </p>
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
                <li>Choose a folder where you frequently save downloads</li>
                <li>KLIN will monitor this folder for new files</li>
                <li>Files will be automatically organized based on your rules</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!tempWatchingFolder.trim()}>
          Next: Choose Setup Mode
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  )
}
