/**
 * Dashboard Page
 * 
 * This is the main entry point that composes all sub-features.
 * State management is handled by Zustand store in ./store/useDashboardStore.ts
 * 
 * Structure:
 * - Uses hooks for business logic (see ./hooks/)
 * - Imports UI components from sub-feature folders
 * - Minimal logic in this file - just composition
 */

import { Sparkles, Settings, Bell, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

// Hooks
import { useFileLoading } from './hooks/useFileLoading'
import { useFileSelection } from './hooks/useFileSelection'
import { useOrganize } from './hooks/useOrganize'
import { useAISearch } from './hooks/useAISearch'
import { useFileDelete } from './hooks/useFileDelete'
import { useSummarize } from './hooks/useSummarize'
import { useNotifications } from './hooks/useNotifications'
import { useMeetingPopup } from './hooks/useMeetingPopup'
import { useToast } from '@/components/ui/toast'

// Tauri API
import { FileItem } from '@/lib/tauri-api'

// Sub-feature components
import { WatchingFoldersPanel } from './components/WatchingFoldersPanel'
import { RecentActivityWidget } from './components/RecentActivityWidget'
import { AIInsightsWidget } from './components/AIInsightsWidget'
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
import { NotificationPanel } from '@/components/NotificationPanel'

import { useDashboardStore } from './store/useDashboardStore'
import { useFileStore } from '@/store/useFileStore'
import { usePrivacyStore } from '@/pages/privacy/store/usePrivacyStore'

export function DashboardPage() {
  const navigate = useNavigate()
  const toast = useToast()

  // Initialize file loading
  useFileLoading()

  // Get state from stores
  const { loading, isFirstTimeSetup, isOrganizeOpen, setIsOrganizeOpen, files } = useDashboardStore()
  const currentViewFolderId = useDashboardStore((state) => state.currentViewFolderId)
  const setCurrentViewFolderId = useDashboardStore((state) => state.setCurrentViewFolderId)
  const watchingFolders = useDashboardStore((state) => state.watchingFolders)

  // Get the current folder if viewing one
  const currentFolder = currentViewFolderId 
    ? watchingFolders.find(f => f.id === currentViewFolderId) ?? null
    : null

  // File selection hook
  const {
    filteredFiles,
    selectedFiles,
    selectedFileIds,
    toggleFileSelection,
    handleSelectAll,
    isAllSelected,
    lockedFilesCount,
    selectableFilesCount,
  } = useFileSelection()

  // Get deselectAllFiles from file store
  const { deselectAllFiles } = useFileStore()

  // Get privacy store for lock
  const { addExcludedFile } = usePrivacyStore()

  // Organize hook
  const { generateOrganizePreview, isLoadingOrganize } = useOrganize()

  // AI Search hook
  const {
    isSearchMode,
    isSearching,
    searchResults,
    searchQuery,
    handleSearch,
    handleSearchChange,
    clearSearch,
  } = useAISearch()

  // File delete hook
  const {
    isDeleteOpen,
    isDeleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleBulkDelete,
  } = useFileDelete()

  // Summarize hook
  const { handleSummarize } = useSummarize()

  // Notifications hook
  const {
    isNotificationPanelOpen,
    notifications,
    notificationCount,
    toggleNotificationPanel,
    closeNotificationPanel,
    clearNotification,
    clearAllNotifications,
  } = useNotifications()

  // Meeting popup hook
  const {
    isMeetingPopupOpen,
    closeMeetingPopup,
    confirmMeeting,
  } = useMeetingPopup()

  // Lock selected files
  const handleLockFiles = () => {
    selectedFiles.forEach(file => {
      addExcludedFile(file.path)
    })
    deselectAllFiles()
    toast.success('Files Locked', `${selectedFiles.length} file(s) locked from organization`)
  }

  // Organize logic
  const getOrganizeFiles = (): FileItem[] => {
    if (!currentViewFolderId) {
      return files // Dashboard: organize all files
    }
    return selectedFiles // Inside folder: selected files only
  }

  const getOrganizeMode = (): 'all-folders' | 'selected-files' => {
    return !currentViewFolderId ? 'all-folders' : 'selected-files'
  }

  const canOrganize = !currentViewFolderId || selectedFileIds.length > 0

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
              disabled={!canOrganize}
              onClick={() => setIsOrganizeOpen(true)}
              title={!canOrganize ? 'Select files to organize' : 'Organize files'}
            >
              <Sparkles className="h-4 w-4" />
              Organize
              {!currentViewFolderId && files.length > 0 && (
                <span className="ml-1 text-xs bg-theme-primary text-white px-1.5 py-0.5 rounded-full">
                  All
                </span>
              )}
            </Button>

            <button 
              className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-theme-secondary" />
            </button>
            <button 
              className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary relative"
              onClick={toggleNotificationPanel}
            >
              <Bell className="h-5 w-5 text-theme-secondary" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Watching Folders Panel */}
        <div className="mt-6">
          <WatchingFoldersPanel />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 pb-6 space-y-6 bg-theme-background">
        {isSearchMode ? (
          <AISearchResults 
            files={searchResults}
            searchQuery={searchQuery}
            isSearching={isSearching}
            onBack={clearSearch}
          />
        ) : currentViewFolderId ? (
          <FolderView
            currentFolder={currentFolder}
            onBack={() => setCurrentViewFolderId(null)}
            selectedFileIds={selectedFileIds}
            selectableFilesCount={selectableFilesCount}
            isAllSelected={isAllSelected}
            onSelectAll={handleSelectAll}
            onDeleteClick={openDeleteDialog}
            onSummarizeClick={() => handleSummarize(selectedFiles)}
            onLockClick={handleLockFiles}
            lockedFilesCount={lockedFilesCount}
            filteredFiles={filteredFiles}
            onToggleSelection={toggleFileSelection}
            loading={loading}
          />
        ) : (
          <DashboardView />
        )}
      </div>

      {/* Sticky AI Search Bar */}
      <AISearchBar
        value={searchQuery}
        onChange={handleSearchChange}
        onSearch={() => handleSearch(searchQuery)}
        onClear={clearSearch}
        isSearching={isSearching}
      />

      {/* Dialogs */}
      <OrganizeDialog
        isOpen={isOrganizeOpen}
        onClose={() => setIsOrganizeOpen(false)}
        selectedFiles={getOrganizeFiles()}
        onGenerate={() => generateOrganizePreview(getOrganizeFiles())}
        isLoading={isLoadingOrganize}
        organizeMode={getOrganizeMode()}
      />

      <OrganizePreviewDialog />
      <ChangeWatcherDialog />
      <ManageDestinationsDialog />

      <ConfirmActionDialog
        isOpen={isDeleteOpen}
        actionType="delete"
        selectedFiles={selectedFiles}
        onConfirm={() => handleBulkDelete(selectedFiles)}
        onClose={closeDeleteDialog}
        isLoading={isDeleting}
      />

      <MeetingSchedulingPopup
        isOpen={isMeetingPopupOpen}
        onClose={closeMeetingPopup}
        onConfirm={confirmMeeting}
      />

      <NotificationPanel
        isOpen={isNotificationPanelOpen}
        onClose={closeNotificationPanel}
        notifications={notifications}
        onClearNotification={clearNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  )
}

// Sub-components for cleaner organization
interface FolderViewProps {
  currentFolder: { id: string; name: string; path: string } | null
  onBack: () => void
  selectedFileIds: string[]
  selectableFilesCount: number
  isAllSelected: boolean
  onSelectAll: () => void
  onDeleteClick: () => void
  onSummarizeClick: () => void
  onLockClick: () => void
  lockedFilesCount: number
  filteredFiles: FileItem[]
  onToggleSelection: (id: string) => void
  loading: boolean
}

function FolderView({
  currentFolder,
  onBack,
  selectedFileIds,
  selectableFilesCount,
  isAllSelected,
  onSelectAll,
  onDeleteClick,
  onSummarizeClick,
  onLockClick,
  lockedFilesCount,
  filteredFiles,
  onToggleSelection,
  loading,
}: FolderViewProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
      >
        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      {currentFolder && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-900">{currentFolder.name}</h2>
              <p className="text-sm text-blue-700 font-mono">{currentFolder.path}</p>
            </div>
          </div>
        </div>
      )}
      
      <FileToolbar
        selectedCount={selectedFileIds.length}
        totalCount={selectableFilesCount}
        isAllSelected={isAllSelected}
        onSelectAll={onSelectAll}
        onDeleteClick={onDeleteClick}
        onSummarizeClick={onSummarizeClick}
        onLockClick={onLockClick}
        lockedCount={lockedFilesCount}
      />

      <FileListView
        files={filteredFiles}
        selectedFileIds={selectedFileIds}
        onToggleSelection={onToggleSelection}
        loading={loading}
      />
    </>
  )
}

function DashboardView() {
  return (
    <div className="flex gap-6 h-full">
      <div className="flex-[7] bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden">
        <RecentActivityWidget />
      </div>
      <div className="flex-[3] bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 overflow-hidden">
        <AIInsightsWidget />
      </div>
    </div>
  )
}

export default DashboardPage
