import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFileStore } from '@/store/useFileStore'

interface FileToolbarProps {
  localSearch: string
  setLocalSearch: (search: string) => void
  selectedCount: number
  totalCount: number
  isAllSelected: boolean
  onSelectAll: () => void
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

// Toolbar Component (contains only select all and search)
export function FileToolbar({
  localSearch,
  setLocalSearch,
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
}: FileToolbarProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
            <span>Select All</span>
          </div>
          <span>•</span>
          <span>
            {selectedCount} of {totalCount} selected
          </span>
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
