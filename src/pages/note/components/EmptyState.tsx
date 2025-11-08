import { Button } from '@/components/ui/button'
import { Plus, StickyNote } from 'lucide-react'

export function EmptyState() {
  return (
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
  )
}
