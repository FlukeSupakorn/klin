import { Button } from '@/components/ui/button'
import { Plus, StickyNote } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="h-24 w-24 rounded-full bg-theme-tertiary flex items-center justify-center mx-auto mb-4">
          <StickyNote className="h-12 w-12 text-theme-muted" />
        </div>
        <h3 className="text-xl font-semibold text-theme-text mb-2">No notes yet</h3>
        <p className="text-theme-secondary mb-6">Start creating notes to keep track of your ideas</p>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Your First Note
        </Button>
      </div>
    </div>
  )
}
