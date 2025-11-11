import { useState } from 'react'
import { FolderOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { FileTreeNode, FileNode } from './FileTreeNode'

interface FileExplorerProps {
  fileTree: FileNode[]
  expandedFolders: Set<string>
  selectedPath: string | null
  onToggle: (path: string) => void
  onSelect: (node: FileNode) => void
}

export function FileExplorer({
  fileTree,
  expandedFolders,
  selectedPath,
  onToggle,
  onSelect,
}: FileExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-1/2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">File Explorer</h2>
        </div>
        <Input
          placeholder="Search files and folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {fileTree.map((root) => (
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
        ))}
      </div>
    </div>
  )
}
