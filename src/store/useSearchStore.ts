/**
 * Global Search Store
 * 
 * Manages AI search state across the entire application.
 * Used by the sidebar search bar and consumed by pages that display results.
 */

import { create } from 'zustand'
import { FileItem } from '@/lib/tauri-api'

interface SearchState {
  // Search state
  isSearchMode: boolean
  isSearching: boolean
  searchQuery: string
  searchResults: FileItem[]
  
  // Actions
  setSearchMode: (mode: boolean) => void
  setSearching: (searching: boolean) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: FileItem[]) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  // Initial state
  isSearchMode: false,
  isSearching: false,
  searchQuery: '',
  searchResults: [],

  // Actions
  setSearchMode: (mode) => set({ isSearchMode: mode }),
  setSearching: (searching) => set({ isSearching: searching }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  
  clearSearch: () => set({
    isSearchMode: false,
    isSearching: false,
    searchQuery: '',
    searchResults: [],
  }),
}))
