import { Button } from '@/components/ui/button'
import { Settings, Bell, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNoteSearch } from './hooks/useNoteSearch'
import { NoteSearchBar } from './components/NoteSearchBar'
import { EmptyState } from './components/EmptyState'

export function NotePage() {
  const navigate = useNavigate()
  const { searchQuery, setSearchQuery } = useNoteSearch()

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notes</h1>
            <p className="text-sm text-slate-500 mt-1">Create and manage your notes</p>
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
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Note
            </Button>
          </div>
        </div>

        <NoteSearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <EmptyState />
      </div>
    </div>
  )
}

export default NotePage
