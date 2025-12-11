import { CheckCircle2, X, XCircle, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useActivityStore } from '@/pages/activity/store/useActivityStore'

export function RecentActivityWidget() {
  const navigate = useNavigate()
  const queue = useActivityStore((state) => state.queue)
  const history = useActivityStore((state) => state.history)
  const isProcessing = useActivityStore((state) => state.isProcessing)
  const currentIndex = useActivityStore((state) => state.currentIndex)
  const totalFiles = useActivityStore((state) => state.totalFiles)
  const rejectAll = useActivityStore((state) => state.rejectAll)
  const moveToHistory = useActivityStore((state) => state.moveToHistory)
  const removeFromQueue = useActivityStore((state) => state.removeFromQueue)
  const cancelProcessing = useActivityStore((state) => state.cancelProcessing)
  const approveItem = useActivityStore((state) => state.approveItem)
  const rejectItem = useActivityStore((state) => state.rejectItem)

  const hasCompletedItems = queue.some((item) => item.status === 'completed')
  const recentHistory = history.slice(0, 5) // Show only 5 most recent

  const handleConfirm = () => {
    const completedItems = queue.filter((item) => item.status === 'completed')
    completedItems.forEach((item) => {
      moveToHistory(item)
      removeFromQueue(item.id)
    })
  }

  const handleRejectAll = () => {
    rejectAll()
    setTimeout(() => {
      const currentQueue = useActivityStore.getState().queue
      const completedItems = currentQueue.filter((item) => item.status === 'completed')
      completedItems.forEach((item) => {
        moveToHistory(item)
        removeFromQueue(item.id)
      })
    }, 100)
  }

  const getActionBadge = (action: string, tag?: string) => {
    if (tag === 'duplicated') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          Removed
        </span>
      )
    }
    if (action === 'approved') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <XCircle className="h-3 w-3" />
        Rejected
      </span>
    )
  }

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
            <p className="text-xs text-slate-500">Latest file operations</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/history')}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
        >
          View All
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700">
                Processing...
              </span>
              <span className="text-xs text-slate-500">
                {currentIndex} / {totalFiles}
              </span>
            </div>
            <button
              onClick={cancelProcessing}
              className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
            >
              Cancel
            </button>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentIndex / totalFiles) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Queue */}
      {queue.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-700">
              Queue ({queue.length})
            </h3>
            {hasCompletedItems && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleRejectAll}
                  className="text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
                >
                  Reject All
                </button>
                <button
                  onClick={handleConfirm}
                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-50 transition-all"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {queue.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.original_name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      → {item.suggested_name || item.original_name}
                    </p>
                  </div>
                  {item.status === 'completed' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => rejectItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded-md transition-all"
                        title="Reject"
                      >
                        <X className="h-3.5 w-3.5 text-red-600" />
                      </button>
                      <button
                        onClick={() => approveItem(item.id)}
                        className="p-1 hover:bg-emerald-100 rounded-md transition-all"
                        title="Approve"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      </button>
                    </div>
                  )}
                </div>
                {item.status === 'processing' && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    Processing...
                  </div>
                )}
              </div>
            ))}
            {queue.length > 3 && (
              <button
                onClick={() => navigate('/history')}
                className="w-full text-xs text-slate-500 hover:text-slate-700 py-2 text-center"
              >
                +{queue.length - 3} more in queue
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          History ({history.length})
        </h3>
        
        {history.length === 0 && queue.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 mb-2">
                <Clock className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600 font-medium">No activity yet</p>
              <p className="text-xs text-slate-400 mt-1">Operations will appear here</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-2">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-3 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.original_name}
                    </p>
                    {item.final_name && item.final_name !== item.original_name && (
                      <p className="text-xs text-slate-500 truncate">
                        → {item.final_name}
                      </p>
                    )}
                    {item.duplicateOf && (
                      <p className="text-xs text-orange-600 mt-0.5">
                        Duplicate of: {item.duplicateOf.name} in {item.duplicateOf.folder}
                      </p>
                    )}
                  </div>
                  {getActionBadge(item.action, item.tag)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{item.final_folder ? `→ ${item.final_folder.split('/').pop()}` : ''}</span>
                  <span>{formatTime(item.timestamp)}</span>
                </div>
              </div>
            ))}
            {history.length > 5 && (
              <button
                onClick={() => navigate('/history')}
                className="w-full text-xs text-slate-500 hover:text-slate-700 py-2 text-center font-medium"
              >
                View all {history.length} items →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
