import { FolderSearch, CheckCircle2, Trash2 } from 'lucide-react'

export function InfoCards() {
  return (
    <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-2xl">
      <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
        <FolderSearch className="h-6 w-6 text-theme-primary mx-auto mb-2" />
        <p className="text-sm font-medium text-theme-text">Deep Scan</p>
        <p className="text-xs text-theme-secondary mt-1">Hash-based detection</p>
      </div>
      <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
        <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-theme-text">Safe</p>
        <p className="text-xs text-theme-secondary mt-1">Non-destructive</p>
      </div>
      <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
        <Trash2 className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm font-medium text-theme-text">Free Space</p>
        <p className="text-xs text-theme-secondary mt-1">Reclaim storage</p>
      </div>
    </div>
  )
}
