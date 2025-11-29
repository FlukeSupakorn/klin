import { useState } from 'react'
import { FileItem } from '@/lib/tauri-api'
import { useDashboardStore } from '../store/useDashboardStore'

const SPECIAL_QUERY = 'สไลด์พรีเซ้น senior presentation'

const buildMockFile = (name: string): FileItem => ({
  name,
  path: `C:/supak/Downloads/${name}`,
  is_dir: false,
  size: 575000,
  modified: '2025-08-15T00:00:00Z',
  sourceFolderName: 'supak / Downloads',
})

export function useAISearch() {
  const files = useDashboardStore((state) => state.files)
  
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    const rawQuery = query.trim()
    if (!rawQuery) {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    const normalizedQuery = rawQuery.toLowerCase()
    setIsSearchMode(true)
    setSearchQuery(query)

    // Immediate mock response for the exact phrase
    if (normalizedQuery === SPECIAL_QUERY) {
      const desiredFiles = [
        { key: 'proposalpresentation.pdf', display: 'ProposalPresentation.pdf' },
        { key: 'senior_project_introduction.pdf', display: 'Senior_project_introduction.pdf' },
      ]

      const mockResults: FileItem[] = desiredFiles.map(({ key, display }) => {
        const existing = files.find((file) => file.name.toLowerCase() === key)
        return existing ?? buildMockFile(display)
      })

      setSearchResults(mockResults)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simulate AI search delay (mock semantic search)
    setTimeout(() => {
      // Lowercase mapping keys and filenames for robust matching
      const semanticMappings: { [key: string]: string[] } = {
        'senior project presentation': [
          'proposalpresentation.pdf',
          'senior_project_introduction.pdf',
        ],
        // add more mappings as needed
      }

      let results = files

      // Check if query matches any semantic mapping (case-insensitive)
      const matchedFiles = new Set<string>()
      for (const [semanticQuery, fileNames] of Object.entries(semanticMappings)) {
        if (normalizedQuery.includes(semanticQuery)) {
          fileNames.forEach(fileName => matchedFiles.add(fileName.toLowerCase()))
        }
      }

      // If semantic match found, filter by matched filenames (case-insensitive)
      if (matchedFiles.size > 0) {
        results = files.filter((file) =>
          matchedFiles.has(file.name.toLowerCase())
        )
      } else {
        // Fall back to simple text search (case-insensitive)
        results = files.filter((file) =>
          file.name.toLowerCase().includes(normalizedQuery)
        )
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 800)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
    }
  }

  const clearSearch = () => {
    setIsSearchMode(false)
    setSearchQuery('')
    setSearchResults([])
  }

  return {
    isSearchMode,
    isSearching,
    searchResults,
    searchQuery,
    handleSearch,
    handleSearchChange,
    clearSearch,
  }
}
