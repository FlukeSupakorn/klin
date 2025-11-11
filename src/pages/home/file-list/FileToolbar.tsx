import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Trash2, LayoutGrid, List, LayoutDashboard, ChevronDown } from 'lucide-react'
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

// Combined Toolbar Component (single line with all controls)
export function FileToolbar({
  localSearch,
  setLocalSearch,
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeleteClick,
}: FileToolbarProps) {
  const { currentView, setCurrentView } = useFileStore()
  
  const viewOptions = [
    { value: 'tab', label: 'Tab View', icon: LayoutDashboard },
    { value: 'grid', label: 'Grid View', icon: LayoutGrid },
    { value: 'list', label: 'List View', icon: List },
  ]
  
  const currentOption = viewOptions.find(opt => opt.value === currentView) || viewOptions[0]
  const Icon = currentOption.icon

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Left side: View dropdown, Select all, and Delete */}
      <div className="flex items-center gap-3">
        {/* View Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2 h-10 px-4 bg-white hover:bg-slate-50"
            >
              <Icon className="h-4 w-4" />
              <span>{currentOption.label}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {viewOptions.map((option) => {
              const OptionIcon = option.icon
              return (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setCurrentView(option.value as any)}
                  className="gap-2 cursor-pointer"
                >
                  <OptionIcon className="h-4 w-4" />
                  <span>{option.label}</span>
                  {currentView === option.value && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-sm text-slate-300">|</span>

        {/* Select All Checkbox */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} aria-label="Select all" />
          <span>Select All</span>
        </div>

        <span className="text-sm text-slate-600">•</span>

        {/* Selected Count */}
        <span className="text-sm text-slate-600">
          {selectedCount} of {totalCount} selected
        </span>
        
        {/* Delete Button (shows when items are selected) */}
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

      {/* Right side: Search */}
      <div className="w-72">
        <Input
          placeholder="Search..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
    </div>
  )
}
