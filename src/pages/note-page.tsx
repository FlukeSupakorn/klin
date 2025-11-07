import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Bell, Plus, Search, StickyNote } from 'lucide-react'

export function NotePage() {
  const [searchQuery, setSearchQuery] = useState('')

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
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
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

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search notes..." 
            className="pl-10 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <StickyNote className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No notes yet</h3>
            <p className="text-slate-500 mb-6">Start creating notes to keep track of your ideas</p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
