import { Button } from '@/components/ui/button'

interface DuplicateWarningProps {
  totalDuplicates: number
  totalGroups: number
  totalSavings: string
  onViewDetails: () => void
}

export function DuplicateWarning({ 
  totalDuplicates, 
  totalGroups, 
  totalSavings, 
  onViewDetails 
}: DuplicateWarningProps) {
  return (
    <div className="mt-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold mb-2">⚠️ Duplicates Detected</h3>
          <p className="text-white/90">
            {totalDuplicates} duplicate files found across {totalGroups} groups
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{totalSavings} MB</p>
          <p className="text-white/90">Wasting storage</p>
        </div>
      </div>
      <Button
        onClick={onViewDetails}
        className="mt-4 bg-white text-orange-600 hover:bg-gray-100"
      >
        View Details
      </Button>
    </div>
  )
}
