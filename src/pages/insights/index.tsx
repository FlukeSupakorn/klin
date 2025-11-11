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

import { useState } from 'react'
import { InsightsHeader, EmptyState } from './components/InsightsHeader'
import { FeaturedFolders } from './components/FeaturedFolders'
import { FileExplorer } from './components/FileExplorer'
import { NotePreviewPanel } from './components/NotePreviewPanel'
import { FileNode } from './components/FileTreeNode'
import { DestinationFoldersDialog } from '@/components/ui/destination-folders-dialog'
import { useFeaturedFolders, useFileTree, useHorizontalScroll } from './hooks/useInsights'
import { useNotePreview } from './hooks/useNotePreview'
import { useHomeStore } from '@/pages/home/store/useHomeStore'

export function InsightsPage() {
  // Business logic from hooks
  const { featuredFolders, isLoading, reload, hasDestinations } = useFeaturedFolders()
  const { fileTree, expandedFolders, toggleFolder, navigateToFolder, isLoading: isLoadingTree } = useFileTree()
  const { scrollLeft, scrollRight } = useHorizontalScroll()
  const { selectedItem, notePreview, isLoading: isLoadingNote, onSelectItem } = useNotePreview()
  
  // Destination folder management
  const destinationFolders = useHomeStore((state) => state.destinationFolders)
  const setDestinationFolders = useHomeStore((state) => state.setDestinationFolders)
  
  // Modal state
  const [showDestinationModal, setShowDestinationModal] = useState(false)
  
  const handleSelectFolder = () => {
    setShowDestinationModal(true)
  }
  
  const handleSaveFolders = (folders: string[]) => {
    setDestinationFolders(folders)
  }

  const handleFeaturedFolderClick = (folderPath: string) => {
    // Navigate to the folder in the file tree
    navigateToFolder(folderPath)
    
    // Find the folder node and select it
    const findFolderNode = (nodes: FileNode[]): FileNode | null => {
      for (const node of nodes) {
        if (node.path === folderPath) {
          return node
        }
        if (node.children) {
          const found = findFolderNode(node.children)
          if (found) return found
        }
      }
      return null
    }
    
    const folderNode = findFolderNode(fileTree)
    if (folderNode) {
      onSelectItem(folderNode)
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
            onFolderClick={handleFeaturedFolderClick}
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

      {/* Destination Folders Modal */}
      <DestinationFoldersDialog
        open={showDestinationModal}
        onOpenChange={setShowDestinationModal}
        currentFolders={destinationFolders}
        onSave={handleSaveFolders}
        title="Select Destination Folders"
        description="Choose multiple folders where your organized files will be stored."
        showTips={true}
      />
    </div>
  )
}

export default InsightsPage
