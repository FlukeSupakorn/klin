import { ChevronRight } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'
import { useDestinations } from './useDestinations'

export function DestinationBanner() {
  const { setIsManageFoldersOpen } = useDashboardStore()
  const { destinationFolders } = useDestinations()

  return (
    <button
      onClick={() => setIsManageFoldersOpen(true)}
      className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700 hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100 transition-all group shadow-sm hover:shadow-md"
    >
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <svg
          className="h-5 w-5 text-emerald-600"
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
      <div className="flex items-center gap-2">
        <span>Destination Folders</span>
        <span className="text-emerald-700 bg-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
          {destinationFolders.length}
        </span>
      </div>
      <ChevronRight className="h-5 w-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
    </button>
  )
}
