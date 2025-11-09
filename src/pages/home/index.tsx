/**
 * Home Page (formerly My Files Page)
 * 
 * This is the main entry point that composes all sub-features.
 * State management is handled by Zustand store in ./store/useHomeStore.ts
 * 
 * Structure:
 * - Uses hooks for business logic
 * - Imports UI components from sub-feature folders
 * - Minimal logic in this file - just composition
 */

import { Upload, Sparkles, Settings, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

// Hooks
import { useFileLoading } from './hooks/useFileLoading'
import { useFileSelection } from './hooks/useFileSelection'
import { useOrganize } from './hooks/useOrganize'

// Sub-feature components
import { WatcherBanner } from './watcher/WatcherBanner'
import { DestinationBanner } from './destination/DestinationBanner'
import { FileListView } from './file-list/FileListView'
import { FileToolbar, ViewSwitcher } from './file-list/FileToolbar'
import { FirstTimeSetupDialog } from './onboarding/FirstTimeSetupDialog'
import { OrganizeDialog } from './organize/OrganizeDialog'
import { OrganizePreviewDialog } from './organize/OrganizePreviewDialog'
import { ChangeWatcherDialog } from './watcher/ChangeWatcherDialog'
import { ManageDestinationsDialog } from './destination/ManageDestinationsDialog'

import { useHomeStore } from './store/useHomeStore'

export function HomePage() {
  // Initialize file loading
  const { reloadFiles, watchedFolder } = useFileLoading()
  const navigate = useNavigate()

  // Get state from stores
  const { loading, isFirstTimeSetup, isOrganizeOpen, setIsOrganizeOpen } = useHomeStore()

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

  const { generateOrganizePreview, isLoadingOrganize } = useOrganize()

  // Show first-time setup if needed
  if (isFirstTimeSetup) {
    return <FirstTimeSetupDialog />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Files</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and organize your files</p>
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
              className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>

            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>

        {/* Folder Watcher and Destination Banners */}
        <div className="mt-4 space-y-3">
          <WatcherBanner />
          <DestinationBanner />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* View Switcher - Above the toolbar box */}
        <ViewSwitcher />

        {/* Toolbar - Contains only select all and search */}
        <FileToolbar
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          selectedCount={selectedFileIds.length}
          totalCount={filteredFiles.length}
          isAllSelected={isAllSelected}
          onSelectAll={handleSelectAll}
        />

        {/* File List */}
        <FileListView
          files={filteredFiles}
          selectedFileIds={selectedFileIds}
          onToggleSelection={toggleFileSelection}
          onFileDeleted={() => watchedFolder && reloadFiles(watchedFolder)}
          loading={loading}
        />
      </div>

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
    </div>
  )
}

// Export as default for easier importing
export default HomePage
