import { ChevronRight, File, Folder } from 'lucide-react'
import { openFile } from '@/lib/tauri-api'

export interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
}

interface FileTreeNodeProps {
  node: FileNode
  level: number
  expanded: Set<string>
  onToggle: (path: string) => void
  onSelect: (node: FileNode) => void
  selectedPath: string | null
  searchQuery: string
}

export function FileTreeNode({ 
  node, 
  level, 
  expanded, 
  onToggle, 
  onSelect, 
  selectedPath, 
  searchQuery 
}: FileTreeNodeProps) {
  const isExpanded = expanded.has(node.path)
  const selected = selectedPath === node.path
  const matchesSearch = searchQuery === '' || node.name.toLowerCase().includes(searchQuery.toLowerCase())

  // Hide non-matching files (but always show folders that might contain matches)
  if (!matchesSearch && !node.isDir) {
    return null
  }

  const handleClick = async () => {
    if (node.isDir) {
      onToggle(node.path)
      onSelect(node)
    } else {
      // For files: open with system application
      try {
        await openFile(node.path)
      } catch (error) {
        console.error('Failed to open file:', error)
      }
    }
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-2 rounded-lg hover-bg-theme-secondary cursor-pointer transition-colors ${
          selected ? 'bg-theme-primary-light hover:bg-theme-primary-light' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {node.isDir && (
          <ChevronRight
            className={`h-4 w-4 text-theme-muted transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        )}
        {!node.isDir && <div className="w-4" />}
        
        {node.isDir ? (
          <Folder className="h-4 w-4 text-theme-primary flex-shrink-0" />
        ) : (
          <File className="h-4 w-4 text-theme-muted flex-shrink-0" />
        )}
        
        <span className={`text-sm truncate ${selected ? 'font-medium text-theme-primary' : 'text-theme-text'}`}>
          {node.name}
        </span>
      </div>

      {node.isDir && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedPath={selectedPath}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  )
}
