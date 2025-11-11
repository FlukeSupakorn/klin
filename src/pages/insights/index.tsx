import { useState, useEffect } from 'react'
import { Sparkles, FolderOpen, FileText, ChevronRight, TrendingUp, ChevronLeft, File, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { getFeaturedFolders, generateFolderNote, generateFileNote, type FolderInsight } from '@/lib/ai-api'

// Mock destination folders - in real app, get from settings
const mockDestinationFolders = [
  'C:\\Documents\\Projects',
  'C:\\Documents\\Reports',
  'C:\\Downloads\\Research',
]

interface FileNode {
  name: string
  path: string
  isDir: boolean
  children?: FileNode[]
}

// Mock file tree structure
const createMockFileTree = (rootPath: string): FileNode => {
  const rootName = rootPath.split(/[\\/]/).pop() || rootPath
  
  return {
    name: rootName,
    path: rootPath,
    isDir: true,
    children: [
      {
        name: '2024 Planning',
        path: `${rootPath}\\2024 Planning`,
        isDir: true,
        children: [
          { name: 'Q1_Strategy.pdf', path: `${rootPath}\\2024 Planning\\Q1_Strategy.pdf`, isDir: false },
          { name: 'Budget_2024.xlsx', path: `${rootPath}\\2024 Planning\\Budget_2024.xlsx`, isDir: false },
          { name: 'Team_Goals.docx', path: `${rootPath}\\2024 Planning\\Team_Goals.docx`, isDir: false },
        ],
      },
      {
        name: 'Archive',
        path: `${rootPath}\\Archive`,
        isDir: true,
        children: [
          { name: 'Old_Reports.pdf', path: `${rootPath}\\Archive\\Old_Reports.pdf`, isDir: false },
          { name: 'Legacy_Data.csv', path: `${rootPath}\\Archive\\Legacy_Data.csv`, isDir: false },
        ],
      },
      { name: 'README.txt', path: `${rootPath}\\README.txt`, isDir: false },
      { name: 'Summary.md', path: `${rootPath}\\Summary.md`, isDir: false },
      { name: 'Data_Analysis.xlsx', path: `${rootPath}\\Data_Analysis.xlsx`, isDir: false },
    ],
  }
}

// File Tree Node Component
interface FileTreeNodeProps {
  node: FileNode
  level: number
  expanded: Set<string>
  onToggle: (path: string) => void
  onSelect: (node: FileNode) => void
  selectedPath: string | null
  searchQuery: string
}

function FileTreeNode({ node, level, expanded, onToggle, onSelect, selectedPath, searchQuery }: FileTreeNodeProps) {
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

export function InsightsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredFolders, setFeaturedFolders] = useState<FolderInsight[]>([])
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  // File explorer state
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<FileNode | null>(null)
  const [notePreview, setNotePreview] = useState<string>('')
  const [isLoadingNote, setIsLoadingNote] = useState(false)

  useEffect(() => {
    loadFeaturedFolders()
    loadFileTree()
  }, [])

  const loadFeaturedFolders = async () => {
    setIsLoadingFeatured(true)
    try {
      const featured = await getFeaturedFolders(mockDestinationFolders)
      setFeaturedFolders(featured)
    } catch (error) {
      console.error('Failed to load featured folders:', error)
    } finally {
      setIsLoadingFeatured(false)
    }
  }

  const loadFileTree = () => {
    const tree = mockDestinationFolders.map(createMockFileTree)
    setFileTree(tree)
  }

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-scroll')
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleSelectItem = async (item: FileNode) => {
    setSelectedItem(item)
    setIsLoadingNote(true)
    setNotePreview('')
    
    try {
      if (item.isDir) {
        const note = await generateFolderNote(item.path, item.name)
        setNotePreview(note)
      } else {
        const note = await generateFileNote(item.path, item.name)
        setNotePreview(note)
      }
    } catch (error) {
      console.error('Failed to load note:', error)
      setNotePreview('Failed to generate preview note.')
    } finally {
      setIsLoadingNote(false)
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-rose-100 text-rose-700 border-rose-200'
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return '🔥'
      case 'medium':
        return '⚡'
      default:
        return '📁'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Insights</h1>
              <p className="text-sm text-slate-600">Intelligent file organization and summaries</p>
            </div>
          </div>

          <Button variant="outline" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        {/* Featured Folders - Horizontal Scroll */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Featured Folders</h2>
              <span className="text-sm text-slate-500">AI-identified important locations</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleScroll('left')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleScroll('right')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={loadFeaturedFolders}>
                <Sparkles className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {isLoadingFeatured ? (
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-[400px] bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div 
              id="featured-scroll"
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              style={{ scrollbarWidth: 'thin' }}
            >
              {featuredFolders.map((folder) => (
                <div
                  key={folder.folderPath}
                  className="flex-shrink-0 w-[400px] bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    console.log('Navigate to folder:', folder.folderPath)
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getImportanceIcon(folder.importance)}</span>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {folder.folderName}
                        </h3>
                        <p className="text-xs text-slate-500">{folder.fileCount} files</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>

                  {/* Overview */}
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{folder.overview}</p>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {folder.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-1">
                    {folder.highlights.slice(0, 2).map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                        <div className="h-1 w-1 rounded-full bg-indigo-600" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Importance Badge */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getImportanceColor(folder.importance)}`}>
                      {folder.importance.toUpperCase()} PRIORITY
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Explorer with Note Preview */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left: File Explorer */}
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
                  onToggle={toggleFolder}
                  onSelect={handleSelectItem}
                  selectedPath={selectedItem?.path || null}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
          </div>

          {/* Right: Note Preview */}
          <div className="w-1/2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">AI Note Preview</h2>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {!selectedItem ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-16 w-16 text-slate-300 mb-4" />
                  <p className="text-slate-600 font-medium">No item selected</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Select a file or folder to view AI-generated notes
                  </p>
                </div>
              ) : isLoadingNote ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="pt-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full mt-2" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </div>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="markdown-preview whitespace-pre-wrap">{notePreview}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsPage
