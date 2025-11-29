/**
 * Dashboard Page
 * 
 * This is the main entry point that composes all sub-features.
 * State management is handled by Zustand store in ./store/useDashboardStore.ts
 * 
 * Structure:
 * - Uses hooks for business logic
 * - Imports UI components from sub-feature folders
 * - Minimal logic in this file - just composition
 */

import { Sparkles, Settings, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

// Hooks
import { useFileLoading } from './hooks/useFileLoading'
import { useFileSelection } from './hooks/useFileSelection'
import { useOrganize } from './hooks/useOrganize'
import { useToast } from '@/components/ui/toast'

// Tauri API
import { deleteFile, FileItem } from '@/lib/tauri-api'

// AI API
import { generateBatchSummaries, createNoteFromSummaries } from '@/lib/ai-api'
import { createNote } from '@/lib/note-api'

// Sub-feature components
import { DestinationBanner } from './destination/DestinationBanner'
import { WatchingFoldersPanel } from './components/WatchingFoldersPanel'
import { FileListView } from './file-list/FileListView'
import { FileToolbar } from './file-list/FileToolbar'
import { FirstTimeSetupDialog } from './onboarding/FirstTimeSetupDialog'
import { OrganizeDialog } from './organize/OrganizeDialog'
import { OrganizePreviewDialog } from './organize/OrganizePreviewDialog'
import { ChangeWatcherDialog } from './watcher/ChangeWatcherDialog'
import { ManageDestinationsDialog } from './destination/ManageDestinationsDialog'
import { ConfirmActionDialog } from './shared/ConfirmActionDialog'
import { AISearchBar } from './components/AISearchBar'
import { AISearchResults } from './components/AISearchResults'
import { MeetingSchedulingPopup } from '../calendar/components/MeetingSchedulingPopup'
import { NotificationPanel, Notification } from '@/components/NotificationPanel'

import { useDashboardStore } from './store/useDashboardStore'
import { useFileStore } from '@/store/useFileStore'
import { useEffect } from 'react'

export function DashboardPage() {
  // Initialize file loading
  const { reloadFiles } = useFileLoading()
  const navigate = useNavigate()

  // Get state from stores
  const { loading, isFirstTimeSetup, isOrganizeOpen, setIsOrganizeOpen, files } = useDashboardStore()

  // Use hooks for logic
  const {
    localSearch,
    setLocalSearch,
    filteredFiles,
    selectedFiles,
    selectedFileIds,
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
  } = useFileSelection()

  // Get deselectAllFiles from file store
  const { deselectAllFiles } = useFileStore()

  const { generateOrganizePreview, isLoadingOrganize } = useOrganize()
  
  const toast = useToast()

  // Search state
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof filteredFiles>([])

  // Delete state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Meeting scheduling popup state
  const [isMeetingPopupOpen, setIsMeetingPopupOpen] = useState(false)

  // Notification panel state
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Duplicate Files Found',
      message: '15 duplicate files detected in your watched folders, wasting 12.4 MB of storage',
      timestamp: new Date(),
      actionPath: '/file-health',
      actionLabel: 'View Details'
    }
  ])

  // Check for mock scheduling popup on mount
  useEffect(() => {
    const shouldShowPopup = localStorage.getItem('klin-mock-scheduling-popup') === 'true'
    if (shouldShowPopup && !isFirstTimeSetup) {
      // Show popup after a short delay to simulate file scanning
      const timer = setTimeout(() => {
        setIsMeetingPopupOpen(true)
        // Clear the flag so it only shows once per session
        localStorage.setItem('klin-mock-scheduling-popup', 'false')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isFirstTimeSetup])

  const handleMeetingConfirm = () => {
    setIsMeetingPopupOpen(false)
    toast.success('Meeting Confirmed', 'You can view the meeting in your calendar')
  }

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClearAllNotifications = () => {
    setNotifications([])
  }

  const SPECIAL_QUERY = 'สไลด์พรีเซ้น senior presentation'
  const buildMockFile = (name: string): FileItem => ({
    name,
    path: `C:/supak/Downloads/${name}`,
    is_dir: false,
    size: 575000,
    modified: '2025-08-15T00:00:00Z',
    sourceFolderName: 'supak / Downloads',
  })

  // Handle AI Search
  const handleSearch = () => {
    const rawQuery = localSearch.trim()
    if (!rawQuery) {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    const query = rawQuery.toLowerCase()
    setIsSearchMode(true)

    // Immediate mock response for the exact phrase
    if (query === SPECIAL_QUERY) {
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
      const fallbackQuery = query

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
        if (fallbackQuery.includes(semanticQuery)) {
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
          file.name.toLowerCase().includes(fallbackQuery)
        )
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 800)
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
    if (!value.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
    }
  }

  // Handle bulk delete
  const handleDeleteClick = () => setIsDeleteOpen(true)
  
  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true)
      
      const fileCount = selectedFiles.length
      
      // Delete all selected files
      for (const file of selectedFiles) {
        await deleteFile(file.path)
      }
      
      // Clear selection after deletion
      deselectAllFiles()
      
      // Reload files after deletion
      await reloadFiles()
      
      setIsDeleteOpen(false)
      
      // Show success toast
      toast.info(
        'Files Deleted',
        `${fileCount} ${fileCount === 1 ? 'file has' : 'files have'} been deleted successfully`
      )
    } catch (error) {
      console.error('Failed to delete files:', error)
      toast.error('Delete Failed', 'An error occurred while deleting files')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle summarize to note
  const handleSummarizeClick = async () => {
    try {
      toast.info('AI Processing', 'Analyzing selected files...')
      
      // Generate summaries for selected files
      const filesToSummarize = selectedFiles.map(f => ({ name: f.name, path: f.path }))
      const summaries = await generateBatchSummaries(filesToSummarize)
      
      // Create note from summaries
      const noteTitle = `File Summary - ${new Date().toLocaleDateString()}`
      const { content } = await createNoteFromSummaries(summaries, noteTitle)
      
      // Save note
      await createNote(noteTitle, content)
      
      // Clear selection
      deselectAllFiles()
      
      // Show success toast
      toast.success(
        'Note Created',
        `AI summary of ${selectedFiles.length} files saved to Notes`
      )
      
      // Navigate to notes page
      navigate('/note')
    } catch (error) {
      console.error('Failed to summarize files:', error)
      toast.error('Summarize Failed', 'An error occurred while creating the summary')
    }
  }

  // Show first-time setup if needed
  if (isFirstTimeSetup) {
    return <FirstTimeSetupDialog />
  }

  return (
    <div className="flex flex-col h-full bg-theme-background">
      {/* Header */}
      <div className="bg-theme-background border-b border-theme px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-theme-text">My Files</h1>
            <p className="text-sm text-theme-secondary mt-1">Manage and organize your files</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              disabled={selectedFileIds.length === 0}
              onClick={() => setIsOrganizeOpen(true)}
            >
              <Sparkles className="h-4 w-4" />
              Organize
            </Button>

            <button 
              className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-theme-secondary" />
            </button>
            <button 
              className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary relative"
              onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
            >
              <Bell className="h-5 w-5 text-theme-secondary" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Watching Folders Panel - scrollable row */}
        <div className="mt-4">
          <WatchingFoldersPanel />
        </div>

        {/* Destination Banner - compact */}
        <div className="mt-3">
          <DestinationBanner />
        </div>
      </div>

      {/* Main Content Area - add padding bottom for search bar */}
      <div className="flex-1 overflow-auto p-6 pb-6 space-y-6 bg-theme-background">

        {/* Show different content based on search mode */}
        {isSearchMode ? (
          /* AI Search Results View */
          <AISearchResults 
            files={searchResults}
            searchQuery={localSearch}
            isSearching={isSearching}
            onBack={() => {
              setIsSearchMode(false)
              setLocalSearch('')
              setSearchResults([])
            }}
          />
        ) : (
          /* Normal File Browser View */
          <>
            {/* Toolbar - View switcher, select all, delete */}
            <FileToolbar
              selectedCount={selectedFileIds.length}
              totalCount={filteredFiles.length}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              onDeleteClick={handleDeleteClick}
              onSummarizeClick={handleSummarizeClick}
            />

            {/* File List */}
            <FileListView
              files={filteredFiles}
              selectedFileIds={selectedFileIds}
              onToggleSelection={toggleFileSelection}
              loading={loading}
            />
          </>
        )}
      </div>

      {/* Sticky AI Search Bar at Bottom */}
      <AISearchBar
        value={localSearch}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        onClear={() => {
          setIsSearchMode(false)
          setSearchResults([])
        }}
        isSearching={isSearching}
      />

      {/* Dialogs */}
      <OrganizeDialog
        isOpen={isOrganizeOpen}
        onClose={() => setIsOrganizeOpen(false)}
        selectedFiles={selectedFiles}
        onGenerate={() => generateOrganizePreview(selectedFiles)}
        isLoading={isLoadingOrganize}
      />

      <OrganizePreviewDialog />
      <ChangeWatcherDialog />
      <ManageDestinationsDialog />

      {/* Delete Confirmation Dialog */}
      <ConfirmActionDialog
        isOpen={isDeleteOpen}
        actionType="delete"
        selectedFiles={selectedFiles}
        onConfirm={handleBulkDelete}
        onClose={() => setIsDeleteOpen(false)}
        isLoading={isDeleting}
      />

      {/* Meeting Scheduling Popup */}
      <MeetingSchedulingPopup
        isOpen={isMeetingPopupOpen}
        onClose={() => setIsMeetingPopupOpen(false)}
        onConfirm={handleMeetingConfirm}
      />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
        notifications={notifications}
        onClearNotification={handleClearNotification}
        onClearAll={handleClearAllNotifications}
      />
    </div>
  )
}

// Export as default for easier importing
export default DashboardPage
