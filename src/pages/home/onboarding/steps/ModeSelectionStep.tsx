import { ChevronRight, Sparkles, Settings as SettingsIcon } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ModeSelectionStepProps {
  onSelectAI: () => void
  onSelectCustom: () => void
  onBack: () => void
}

export function ModeSelectionStep({ onSelectAI, onSelectCustom, onBack }: ModeSelectionStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl">Choose Folder Organization Mode</DialogTitle>
        <DialogDescription>
          How would you like to set up your destination folders?
        </DialogDescription>
      </DialogHeader>

      <div className="py-6 space-y-4">
        {/* AI Generated Option */}
        <button
          onClick={onSelectAI}
          className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-indigo-600">
                AI Generated Folders
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Let AI automatically create an organized folder structure based on common file types
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Quick setup</span>
                <span>•</span>
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Recommended for beginners</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
          </div>
        </button>

        {/* Custom Option */}
        <button
          onClick={onSelectCustom}
          className="w-full p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-indigo-600">
                Customize Destination Folders
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Manually configure your own folder structure and organization rules
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Full control</span>
                <span>•</span>
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Advanced users</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
          </div>
        </button>
      </div>

      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </DialogFooter>
    </>
  )
}
