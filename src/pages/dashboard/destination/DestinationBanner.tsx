import { ChevronRight } from 'lucide-react'
import { useDashboardStore } from '../store/useDashboardStore'
import { useDestinations } from './useDestinations'

export function DestinationBanner() {
  const { setIsManageFoldersOpen } = useDashboardStore()
  const { destinationFolders } = useDestinations()

  return (
    <button
      onClick={() => setIsManageFoldersOpen(true)}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-medium text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
    >
      <svg
        className="h-3.5 w-3.5 text-emerald-600"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <span>Destinations</span>
      <span className="text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
        {destinationFolders.length}
      </span>
      <ChevronRight className="h-3.5 w-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
    </button>
  )
}
