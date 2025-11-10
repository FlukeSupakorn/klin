import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Filter, Search, CheckCircle2, XCircle, Calendar } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export type FilterType = 'all' | 'approved' | 'rejected' | 'today' | 'week' | 'month'

interface SearchToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeFilter?: FilterType
  onFilterChange?: (filter: FilterType) => void
}

export function SearchToolbar({ 
  searchQuery, 
  onSearchChange,
  activeFilter = 'all',
  onFilterChange 
}: SearchToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filters = [
    { value: 'all' as const, label: 'All Items', icon: null },
    { value: 'approved' as const, label: 'Approved', icon: CheckCircle2, color: 'text-green-600' },
    { value: 'rejected' as const, label: 'Rejected', icon: XCircle, color: 'text-red-600' },
    { value: 'today' as const, label: 'Today', icon: Calendar, color: 'text-blue-600' },
    { value: 'week' as const, label: 'This Week', icon: Calendar, color: 'text-blue-600' },
    { value: 'month' as const, label: 'This Month', icon: Calendar, color: 'text-blue-600' },
  ]

  const handleFilterSelect = (filter: FilterType) => {
    onFilterChange?.(filter)
    setIsFilterOpen(false)
  }

  const activeFilterLabel = filters.find(f => f.value === activeFilter)?.label || 'Filter'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input 
          placeholder="Search in history..." 
          className="pl-10 h-12 text-base"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="relative">
        <Button 
          variant="outline" 
          className="h-12 gap-2"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Filter className="h-4 w-4" />
          {activeFilter !== 'all' ? activeFilterLabel : 'Filter'}
        </Button>

        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsFilterOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
              {filters.map((filter) => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.value}
                    onClick={() => handleFilterSelect(filter.value)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-3",
                      activeFilter === filter.value && "bg-indigo-50 text-indigo-700 font-medium"
                    )}
                  >
                    {Icon && <Icon className={cn("h-4 w-4", filter.color)} />}
                    {!Icon && <span className="w-4" />}
                    <span>{filter.label}</span>
                    {activeFilter === filter.value && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-indigo-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
