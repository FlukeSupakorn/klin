import { useActivityStore } from '../store/useActivityStore'
import { FileIcon } from '@/components/file/file-icon'
import { CheckCircle2, XCircle, FolderOpen, ArrowRight } from 'lucide-react'
import { getFileType } from '@/pages/home/file-list/utils'
import { formatDistanceToNow } from 'date-fns'
import { FilterType } from './SearchToolbar'

interface ActivityListProps {
  searchQuery: string
  activeFilter?: FilterType
}

export function ActivityList({ searchQuery, activeFilter }: ActivityListProps) {
  const history = useActivityStore((state) => state.history)

  const filteredHistory = history.filter((item) => {
    // Search filter
    const matchesSearch = item.original_name.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    // Status filter
    if (activeFilter === 'approved' && item.action !== 'approved') return false
    if (activeFilter === 'rejected' && item.action !== 'rejected') return false

    // Date filters
    const now = new Date()
    const itemDate = new Date(item.timestamp)
    
    if (activeFilter === 'today') {
      const isToday = 
        itemDate.getDate() === now.getDate() &&
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      if (!isToday) return false
    }
    
    if (activeFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      if (itemDate < weekAgo) return false
    }
    
    if (activeFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      if (itemDate < monthAgo) return false
    }

    return true
  })

  return (
    <div className="space-y-2">
      {filteredHistory.map((item) => (
        <div
          key={item.id}
          className="bg-theme-background border border-theme rounded-lg p-4 hover:border-theme-primary transition-colors"
        >
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0">
              <FileIcon type={getFileType(item.original_name, false)} />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              {/* Name Change */}
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-theme-text truncate">
                    {item.original_name}
                  </span>
                  {item.original_name !== item.final_name && (
                    <>
                      <ArrowRight className="h-4 w-4 text-theme-muted flex-shrink-0" />
                      <span className="text-sm font-medium text-theme-primary truncate">
                        {item.final_name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Folder Change */}
              <div className="flex items-center gap-2 text-xs text-theme-muted mb-2">
                <FolderOpen className="h-3 w-3" />
                <span className="truncate">{item.original_folder || 'Unknown'}</span>
                {item.original_folder !== item.final_folder && (
                  <>
                    <ArrowRight className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate text-theme-primary">{item.final_folder}</span>
                  </>
                )}
              </div>

              {/* Timestamp */}
              <div className="text-xs text-theme-muted">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </div>
            </div>

            {/* Action Badge */}
            <div className="flex-shrink-0">
              {item.action === 'approved' ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  <span className="text-xs font-medium text-green-700">Approved</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
                  <XCircle className="h-3.5 w-3.5 text-red-600" />
                  <span className="text-xs font-medium text-red-700">Rejected</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {filteredHistory.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>No history items found</p>
        </div>
      )}
    </div>
  )
}
