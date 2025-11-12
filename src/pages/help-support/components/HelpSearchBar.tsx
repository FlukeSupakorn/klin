import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface HelpSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function HelpSearchBar({ searchQuery, onSearchChange }: HelpSearchBarProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search for help..."
          className="pl-12 h-14 text-base"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
