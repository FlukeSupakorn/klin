import { useState } from 'react'

export function useNoteSearch() {
  const [searchQuery, setSearchQuery] = useState('')

  return {
    searchQuery,
    setSearchQuery,
  }
}
