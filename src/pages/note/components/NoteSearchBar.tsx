import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface NoteSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function NoteSearchBar({ searchQuery, onSearchChange }: NoteSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input 
        placeholder="Search notes..." 
        className="pl-10 h-12 text-base"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  )
}
