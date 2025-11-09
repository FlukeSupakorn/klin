import { Sparkles } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AIGeneratedFolder {
  name: string
  description: string
  path: string
}

interface AIGeneratedStepProps {
  tempWatchingFolder: string
  aiGeneratedFolders: AIGeneratedFolder[]
  onBack: () => void
  onComplete: () => void
}

export function AIGeneratedStep({
  tempWatchingFolder,
  aiGeneratedFolders,
  onBack,
  onComplete,
}: AIGeneratedStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">AI Generated Folder Structure</DialogTitle>
        <DialogDescription>
          Review the folders AI will create for organizing your files
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-indigo-900">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">AI will create {aiGeneratedFolders.length} folders in:</span>
          </div>
          <p className="text-sm text-indigo-700 font-mono mt-1 ml-6">
            {tempWatchingFolder}/Organized/
          </p>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {aiGeneratedFolders.map((folder, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-5 w-5 text-indigo-600"
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
                <h4 className="text-sm font-semibold text-slate-900 mb-1">{folder.name}</h4>
                <p className="text-xs text-slate-500 mb-1">{folder.description}</p>
                <p className="text-xs text-slate-400 font-mono truncate" title={folder.path}>
                  {folder.path}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0"
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
              <p className="text-sm font-medium text-amber-900 mb-1">Note:</p>
              <p className="text-xs text-amber-700">
                These folders will be created automatically when you complete setup. You can always modify them later in settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete}>
          <Sparkles className="h-4 w-4 mr-2" />
          Create Folders & Complete Setup
        </Button>
      </DialogFooter>
    </>
  )
}
