import { ChevronRight } from 'lucide-react'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          Welcome to KLIN!
        </DialogTitle>
        <DialogDescription className="text-base pt-2">
          Let's get you started with organizing your files automatically.
        </DialogDescription>
      </DialogHeader>

      <div className="py-6">
        <div className="bg-theme-primary-light rounded-lg p-6 mb-6 border border-theme-primary">
          <h3 className="text-lg font-semibold text-theme-text mb-4">
            What KLIN can do for you:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-theme-text">Automatically Organize Files</p>
                <p className="text-sm text-theme-secondary">
                  Watch folders and organize files by type, date, or custom rules
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-theme-text">Smart Renaming</p>
                <p className="text-sm text-theme-secondary">
                  Rename files with meaningful names based on content analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-theme-text">AI-Powered Summaries</p>
                <p className="text-sm text-theme-secondary">
                  Generate summaries and insights for your documents
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-theme-secondary text-center">
          This quick setup will take less than a minute. Let's configure your folders!
        </p>
      </div>

      <DialogFooter>
        <Button onClick={onNext} className="w-full">
          Get Started
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </DialogFooter>
    </>
  )
}
