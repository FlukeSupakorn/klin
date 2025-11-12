import { useState } from 'react'
import { FolderOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { FileTreeNode, FileNode } from './FileTreeNode'

interface FileExplorerProps {
  fileTree: FileNode[]
  expandedFolders: Set<string>
  selectedPath: string | null
  onToggle: (path: string) => void
  onSelect: (node: FileNode) => void
  isLoading?: boolean
}

export function FileExplorer({
  fileTree,
  expandedFolders,
  selectedPath,
  onToggle,
  onSelect,
  isLoading = false,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-1/2 bg-theme-background border border-theme rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-theme">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="h-5 w-5 text-theme-primary" />
          <h2 className="text-lg font-semibold text-theme-text">File Explorer</h2>
        </div>
        <Input
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-5/6 ml-4" />
            <Skeleton className="h-8 w-4/6 ml-8" />
            <Skeleton className="h-8 w-5/6 ml-4" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          fileTree.map((root) => (
            <FileTreeNode
              key={root.path}
              node={root}
              level={0}
              expanded={expandedFolders}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedPath={selectedPath}
              searchQuery={searchQuery}
            />
          ))
        )}
      </div>
    </div>
  )
}
