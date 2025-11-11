/**
 * AI Insights Page
 * 
 * This is the main entry point that composes all sub-features.
 * 
 * Structure:
 * - Uses hooks for business logic (hooks/)
 * - Imports UI components from components/
 * - Minimal logic in this file - just composition
 */

import { InsightsHeader, EmptyState } from './components/InsightsHeader'
import { FeaturedFolders } from './components/FeaturedFolders'
import { FileExplorer } from './components/FileExplorer'
import { NotePreviewPanel } from './components/NotePreviewPanel'
import { useFeaturedFolders, useFileTree, useHorizontalScroll } from './hooks/useInsights'
import { useNotePreview } from './hooks/useNotePreview'
import { useHomeStore } from '@/pages/home/store/useHomeStore'
import { selectFolder } from '@/lib/tauri-api'

export function InsightsPage() {
  // Business logic from hooks
  const { featuredFolders, isLoading, reload, hasDestinations } = useFeaturedFolders()
  const { fileTree, expandedFolders, toggleFolder, isLoading: isLoadingTree } = useFileTree()
  const { scrollLeft, scrollRight } = useHorizontalScroll()
  const { selectedItem, notePreview, isLoading: isLoadingNote, onSelectItem } = useNotePreview()
  
  // Destination folder management
  const addDestinationFolder = useHomeStore((state) => state.addDestinationFolder)
  
  const handleSelectFolder = async () => {
    try {
      const folder = await selectFolder('Select Destination Folder')
      if (folder) {
        addDestinationFolder(folder)
      }
    } catch (error) {
      console.error('Failed to select folder:', error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <InsightsHeader />

      {!hasDestinations ? (
        <EmptyState onSelectFolder={handleSelectFolder} />
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
          {/* Featured Folders - Horizontal Scroll */}
          <FeaturedFolders
            folders={featuredFolders}
            isLoading={isLoading}
            onScrollLeft={scrollLeft}
            onScrollRight={scrollRight}
            onRefresh={reload}
          />

          {/* File Explorer with Note Preview */}
          <div className="flex-1 flex gap-4 overflow-hidden">
            <FileExplorer
              fileTree={fileTree}
              expandedFolders={expandedFolders}
              selectedPath={selectedItem?.path || null}
              onToggle={toggleFolder}
              onSelect={onSelectItem}
              isLoading={isLoadingTree}
            />

            <NotePreviewPanel
              selectedItem={selectedItem}
              notePreview={notePreview}
              isLoading={isLoadingNote}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightsPage
