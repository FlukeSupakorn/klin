import { ChevronRight } from 'lucide-react'
import { useHomeStore } from '../store/useHomeStore'
import { useDestinations } from './useDestinations'

export function DestinationBanner() {
  const { setIsManageFoldersOpen } = useHomeStore()
  const { destinationFolders } = useDestinations()

  return (
    <button
      onClick={() => setIsManageFoldersOpen(true)}
      className="flex items-center gap-3 w-full bg-emerald-50 border border-emerald-200 rounded-lg p-3 hover:bg-emerald-100 transition-colors"
    >
      <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center flex-shrink-0">
        <svg
          className="h-5 w-5 text-white"
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
      <div className="flex-1 text-left min-w-0">
        <div className="text-sm font-medium text-emerald-900">
          Destination Folders ({destinationFolders.length})
        </div>
        <div className="text-xs text-emerald-700">
          {destinationFolders.length === 0 ? (
            'No destinations set'
          ) : destinationFolders.length === 1 ? (
            <span className="truncate block" title={destinationFolders[0]}>
              {destinationFolders[0]}
            </span>
          ) : (
            `${destinationFolders.length} folders configured`
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0" />
    </button>
  )
}
