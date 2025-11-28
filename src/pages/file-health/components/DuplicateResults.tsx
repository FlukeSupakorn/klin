import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DuplicateFileList } from './DuplicateFileList'

interface DuplicateGroup {
  id: number
  files: Array<{
    path: string
    name: string
    size: string
    folder: string
  }>
  totalSize: string
  potentialSavings: string
}

interface DuplicateResultsProps {
  duplicates: DuplicateGroup[]
  totalDuplicates: number
  totalSavings: string
  selectedFiles: Set<string>
  onToggleFile: (path: string) => void
  onScanAgain: () => void
  onDeleteSelected: () => void
}

export function DuplicateResults({
  duplicates,
  totalDuplicates,
  totalSavings,
  selectedFiles,
  onToggleFile,
  onScanAgain,
  onDeleteSelected
}: DuplicateResultsProps) {
  return (
    <div className="space-y-6 mt-8">
      {/* Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Scan Complete!</h2>
            <p className="text-white/90">
              Found {totalDuplicates} duplicate files across {duplicates.length} groups
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{totalSavings} MB</p>
            <p className="text-white/90">Potential savings</p>
          </div>
        </div>
      </div>

      {/* Action Bar - only show when files are selected */}
      {selectedFiles.size > 0 && (
        <div className="flex items-center justify-between bg-theme-background border border-theme rounded-xl p-4">
          <p className="text-sm text-theme-secondary">
            {selectedFiles.size} files selected
          </p>
          <Button
            className="gap-2"
            onClick={onDeleteSelected}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Duplicate Groups */}
      <DuplicateFileList 
        duplicates={duplicates}
        selectedFiles={selectedFiles}
        onToggleFile={onToggleFile}
      />
    </div>
  )
}
