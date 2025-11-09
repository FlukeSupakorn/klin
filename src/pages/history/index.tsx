import { Settings, Bell, CheckCircle2, X, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useActivityStore } from './store/useActivityStore'
import { SearchToolbar } from './components/SearchToolbar'
import { ActivityQueue } from './components/ActivityQueue'
import { HistoryList } from './components/HistoryList'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function HistoryPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  
  const queue = useActivityStore((state) => state.queue)
  const history = useActivityStore((state) => state.history)
  const isProcessing = useActivityStore((state) => state.isProcessing)
  const currentIndex = useActivityStore((state) => state.currentIndex)
  const totalFiles = useActivityStore((state) => state.totalFiles)
  const rejectAll = useActivityStore((state) => state.rejectAll)
  const moveToHistory = useActivityStore((state) => state.moveToHistory)
  const removeFromQueue = useActivityStore((state) => state.removeFromQueue)
  const cancelProcessing = useActivityStore((state) => state.cancelProcessing)

  const hasCompletedItems = queue.some((item) => item.status === 'completed')

  const handleConfirm = () => {
    // Move all items to history with their current userAction
    const completedItems = queue.filter((item) => item.status === 'completed')
    completedItems.forEach((item) => {
      moveToHistory(item)
      removeFromQueue(item.id)
    })
  }

  const handleRejectAll = () => {
    rejectAll()
    // Auto-confirm after rejecting all - move all to history
    setTimeout(() => {
      const currentQueue = useActivityStore.getState().queue
      const completedItems = currentQueue.filter((item) => item.status === 'completed')
      completedItems.forEach((item) => {
        moveToHistory(item)
        removeFromQueue(item.id)
      })
    }, 100)
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Activity</h1>
            <p className="text-sm text-slate-500 mt-1">
              Track file organization progress and history
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        <SearchToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {/* Processing Progress */}
        {isProcessing && (
          <div className="mb-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-indigo-900">
                  Processing files...
                </span>
                <span className="text-sm text-indigo-700">
                  {currentIndex} / {totalFiles}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelProcessing}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentIndex / totalFiles) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Queue Section */}
        {queue.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Current Queue ({queue.length})
              </h2>
              
              {hasCompletedItems && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRejectAll}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleConfirm}
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm
                  </Button>
                </div>
              )}
            </div>
            
            <ActivityQueue searchQuery={searchQuery} />
          </div>
        )}

        {/* History Section */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            History ({history.length})
          </h2>
          
          {history.length === 0 && queue.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 mb-4">
                <svg
                  className="h-8 w-8 text-slate-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No activity yet</h3>
              <p className="text-sm text-slate-500">
                Organize files to see them appear here
              </p>
            </div>
          ) : (
            <HistoryList searchQuery={searchQuery} />
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
