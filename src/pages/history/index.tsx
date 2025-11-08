import { Settings, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useHistoryData } from './hooks/useHistoryData'
import { SearchToolbar } from './components/SearchToolbar'
import { HistoryTable } from './components/HistoryTable'

export function HistoryPage() {
  const navigate = useNavigate()
  const {
    searchQuery,
    setSearchQuery,
    filteredFiles,
    selectedFile,
    setSelectedFile,
  } = useHistoryData()

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">File History</h1>
            <p className="text-sm text-slate-500 mt-1">View and track file modifications</p>
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
        <HistoryTable
          files={filteredFiles}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
      </div>
    </div>
  )
}

export default HistoryPage
