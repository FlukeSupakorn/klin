import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Filter, Search } from 'lucide-react'

interface SearchToolbarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SearchToolbar({ searchQuery, onSearchChange }: SearchToolbarProps) {
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
      <Button variant="outline" className="h-12 gap-2">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
    </div>
  )
}
