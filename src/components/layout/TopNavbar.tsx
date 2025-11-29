 /**
 * TopNavbar
 * 
 * Global top navigation bar with:
 * - Page title (dynamic based on route)
 * - AI-powered search
 * - Organize button (dashboard only)
 * - Settings & Notifications
 */

import { useRef, useState } from 'react'
import { Search, Sparkles, X, Settings, Bell } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSearchStore } from '@/store/useSearchStore'
import { useDashboardStore } from '@/pages/dashboard/store/useDashboardStore'
import { useNavbar } from './NavbarContext'

const SPECIAL_QUERY = 'สไลด์พรีเซ้น senior presentation'

const buildMockFile = (name: string) => ({
  name,
  path: `C:/supak/Downloads/${name}`,
  is_dir: false,
  size: 575000,
  modified: '2025-08-15T00:00:00Z',
  sourceFolderName: 'supak / Downloads',
})

// Page title mapping
const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'My Files', subtitle: 'Manage and organize your files' },
  '/calendar': { title: 'Calendar', subtitle: 'View your schedule and events' },
  '/file-health': { title: 'File Health', subtitle: 'Monitor your file system health' },
  '/history': { title: 'Activity', subtitle: 'View your recent activity' },
  '/note': { title: 'Notes', subtitle: 'Your personal notes and summaries' },
  '/settings': { title: 'Settings', subtitle: 'Customize your preferences' },
  '/insights': { title: 'Insights', subtitle: 'AI-powered file insights' },
  '/help': { title: 'Help & Support', subtitle: 'Get help and support' },
}

export function TopNavbar() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get navbar context
  const {
    canOrganize,
    showOrganizeAll,
    onOrganizeClick,
    customActionButton,
    notificationCount,
    onNotificationClick,
  } = useNavbar()

  // Get page info
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'KLIN', subtitle: '' }
  const isDashboard = location.pathname === '/dashboard'

  // Global search store
  const {
    searchQuery,
    isSearching,
    setSearchMode,
    setSearching,
    setSearchQuery,
    setSearchResults,
    clearSearch,
  } = useSearchStore()

  // Get files for searching
  const files = useDashboardStore((state) => state.files)

  const handleSearch = () => {
    const rawQuery = searchQuery.trim()
    if (!rawQuery) {
      clearSearch()
      return
    }

    const normalizedQuery = rawQuery.toLowerCase()
    setSearchMode(true)

    // Navigate to dashboard if not there
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard')
    }

    // Immediate mock response for the exact phrase
    if (normalizedQuery === SPECIAL_QUERY) {
      const desiredFiles = [
        { key: 'proposalpresentation.pdf', display: 'ProposalPresentation.pdf' },
        { key: 'senior_project_introduction.pdf', display: 'Senior_project_introduction.pdf' },
      ]

      const mockResults = desiredFiles.map(({ key, display }) => {
        const existing = files.find((file) => file.name.toLowerCase() === key)
        return existing ?? buildMockFile(display)
      })

      setSearchResults(mockResults)
      setSearching(false)
      return
    }

    setSearching(true)

    // Simulate AI search delay (mock semantic search)
    setTimeout(() => {
      const semanticMappings: { [key: string]: string[] } = {
        'senior project presentation': [
          'proposalpresentation.pdf',
          'senior_project_introduction.pdf',
        ],
      }

      let results = files
      const matchedFiles = new Set<string>()

      for (const [semanticQuery, fileNames] of Object.entries(semanticMappings)) {
        if (normalizedQuery.includes(semanticQuery)) {
          fileNames.forEach(fileName => matchedFiles.add(fileName.toLowerCase()))
        }
      }

      if (matchedFiles.size > 0) {
        results = files.filter((file) =>
          matchedFiles.has(file.name.toLowerCase())
        )
      } else {
        results = files.filter((file) =>
          file.name.toLowerCase().includes(normalizedQuery)
        )
      }

      setSearchResults(results)
      setSearching(false)
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      clearSearch()
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    clearSearch()
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-[88px] bg-theme-background border-b border-theme flex items-center px-8 py-5 gap-6 shrink-0">
      {/* Page Title */}
      <div className="min-w-[200px]">
        <h1 className="text-3xl font-bold text-theme-text">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <p className="text-sm text-theme-secondary mt-1.5">{pageInfo.subtitle}</p>
        )}
      </div>

      {/* AI Search Bar - Centered */}
      <div className="flex-1 flex justify-center">
        <div
          className={`
            relative flex items-center w-full max-w-lg
            bg-theme-secondary rounded-xl
            border-2 transition-all duration-200
            ${isFocused 
              ? 'border-theme-primary shadow-lg shadow-theme-primary/10' 
              : 'border-transparent hover:border-theme-primary/30'
            }
          `}
        >
          {/* AI Sparkle Icon */}
          <div className="pl-4 flex items-center">
            <div className={`
              p-1.5 rounded-lg transition-all duration-200
              ${isSearching 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white animate-pulse' 
                : isFocused
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-600'
                  : 'bg-theme-tertiary text-theme-muted'
              }
            `}>
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search your files with AI..."
            className={`
              flex-1 py-2.5 px-3
              bg-transparent text-theme-text placeholder-theme-muted
              text-sm outline-none
            `}
          />

          {/* Right side actions */}
          <div className="pr-3 flex items-center gap-2">
            {/* Keyboard hint when not focused */}
            {!isFocused && !searchQuery && (
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-theme-tertiary rounded-md text-[10px] text-theme-muted font-medium">
                <span>⌘</span>
                <span>K</span>
              </kbd>
            )}

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={handleClear}
                className="p-1.5 text-theme-muted hover:text-theme-text transition-colors rounded-lg hover:bg-theme-tertiary"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className={`
                p-2 rounded-xl transition-all duration-200
                ${searchQuery.trim() 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-md' 
                  : 'bg-theme-tertiary text-theme-muted cursor-not-allowed'
                }
              `}
            >
              {isSearching ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Organize Button - Dashboard only */}
        {isDashboard && onOrganizeClick && (
          <Button
            variant="outline"
            className="gap-2"
            disabled={!canOrganize}
            onClick={onOrganizeClick}
            title={!canOrganize ? 'Select files to organize' : 'Organize files'}
          >
            <Sparkles className="h-4 w-4" />
            Organize
            {showOrganizeAll && (
              <span className="ml-1 text-xs bg-theme-primary text-white px-1.5 py-0.5 rounded-full">
                All
              </span>
            )}
          </Button>
        )}

        {/* Custom Action Button - Page specific */}
        {customActionButton}

        {/* Settings */}
        <button 
          className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover:bg-theme-secondary transition-colors"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5 text-theme-secondary" />
        </button>

        {/* Notifications */}
        <button 
          className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover:bg-theme-secondary transition-colors relative"
          onClick={() => onNotificationClick?.()}
        >
          <Bell className="h-5 w-5 text-theme-secondary" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
