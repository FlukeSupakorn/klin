import { Sparkles, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function InsightsHeader() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Insights</h1>
          <p className="text-sm text-slate-600">Intelligent file organization and summaries</p>
        </div>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  onSelectFolder: () => void
}

export function EmptyState({ onSelectFolder }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">No Destination Folders</h2>
        <p className="text-slate-600 mb-6">
          Select your destination folders to start analyzing your files with AI insights.
        </p>
        <Button onClick={onSelectFolder}>
          Select Destination Folder
        </Button>
      </div>
    </div>
  )
}
