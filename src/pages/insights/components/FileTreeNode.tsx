import { ChevronRight, File, Folder } from 'lucide-react'

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

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors ${
          selected ? 'bg-indigo-50 hover:bg-indigo-100' : ''
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => {
          if (node.isDir) {
            onToggle(node.path)
          }
          onSelect(node)
        }}
      >
        {node.isDir && (
          <ChevronRight
            className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        )}
        {!node.isDir && <div className="w-4" />}
        
        {node.isDir ? (
          <Folder className="h-4 w-4 text-indigo-600 flex-shrink-0" />
        ) : (
          <File className="h-4 w-4 text-slate-400 flex-shrink-0" />
        )}
        
        <span className={`text-sm truncate ${selected ? 'font-medium text-indigo-900' : 'text-slate-700'}`}>
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
