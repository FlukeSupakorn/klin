import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2 } from 'lucide-react'
import { useFileStore } from '@/store/useFileStore'

interface FileToolbarProps {
  localSearch: string
  setLocalSearch: (search: string) => void
  selectedCount: number
  totalCount: number
  isAllSelected: boolean
  onSelectAll: () => void
  onDeleteClick: () => void
}

// View Switcher Component (displayed above the toolbar box)
export function ViewSwitcher() {
  const { currentView, setCurrentView } = useFileStore()
  
  return (
    <div className="mb-4">
      <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as 'tab' | 'grid' | 'list')}>
        <TabsList>
          <TabsTrigger value="tab">Tab View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

// Toolbar Component (contains select all, delete button, and search)
export function FileToolbar({
  localSearch,
  setLocalSearch,
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeleteClick,
}: FileToolbarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
            <span>Select All</span>
          </div>
          <span className="text-sm text-slate-600">•</span>
          <span className="text-sm text-slate-600">
            {selectedCount} of {totalCount} selected
          </span>
          
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-slate-600">•</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                onClick={onDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            </>
          )}
        </div>

        <div className="w-72">
          <Input
            placeholder="Search..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
