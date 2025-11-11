import { useState, useEffect } from 'react'
import { Sparkles, FolderOpen, FileText, ChevronRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { getFeaturedFolders, generateFolderInsight, type FolderInsight } from '@/lib/ai-api'

// Mock folder data - in real app, get from file system
const mockFolders = [
  'C:\\Documents\\Projects',
  'C:\\Documents\\Reports',
  'C:\\Downloads\\Research',
  'C:\\Work\\Presentations',
  'C:\\Documents\\Financial',
]

export function InsightsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredFolders, setFeaturedFolders] = useState<FolderInsight[]>([])
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true)

  useEffect(() => {
    loadFeaturedFolders()
  }, [])

  const loadFeaturedFolders = async () => {
    setIsLoadingFeatured(true)
    try {
      const featured = await getFeaturedFolders(mockFolders)
      setFeaturedFolders(featured)
    } catch (error) {
      console.error('Failed to load featured folders:', error)
    } finally {
      setIsLoadingFeatured(false)
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
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Search */}
        <div className="max-w-2xl">
          <Input
            placeholder="Search folders and files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        {/* Featured Folders Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-slate-900">Featured Folders</h2>
              <span className="text-sm text-slate-500">AI-identified important locations</span>
            </div>
            <Button variant="ghost" size="sm" onClick={loadFeaturedFolders}>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh Insights
            </Button>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredFolders.map((folder) => (
                <div
                  key={folder.folderPath}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    // Navigate to folder explorer view
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

        {/* All Folders Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">All Folders</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
            {mockFolders
              .filter((path) => path.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((folderPath) => (
                <FolderRow key={folderPath} folderPath={folderPath} />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Folder Row Component with lazy-loaded insights
function FolderRow({ folderPath }: { folderPath: string }) {
  const [insight, setInsight] = useState<FolderInsight | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const folderName = folderPath.split(/[\\/]/).pop() || folderPath

  const handleExpand = async () => {
    if (!isExpanded && !insight) {
      setIsLoading(true)
      try {
        const fileCount = Math.floor(Math.random() * 50) + 5
        const data = await generateFolderInsight(folderPath, folderName, fileCount)
        setInsight(data)
      } catch (error) {
        console.error('Failed to load insight:', error)
      } finally {
        setIsLoading(false)
      }
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div>
      <div
        className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors"
        onClick={handleExpand}
      >
        <div className="flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-indigo-600" />
          <div>
            <h3 className="font-medium text-slate-900">{folderName}</h3>
            <p className="text-sm text-slate-500">{folderPath}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {insight && (
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              AI Analyzed
            </span>
          )}
          <Button variant="ghost" size="sm">
            <ChevronRight
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* Expanded Insight */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-slate-50">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-32" />
            </div>
          ) : insight ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">{insight.overview}</p>

              <div className="flex flex-wrap gap-2">
                {insight.categories.map((category) => (
                  <span
                    key={category}
                    className="text-xs px-2 py-1 bg-white border border-slate-200 text-slate-700 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="space-y-1">
                {insight.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="h-3 w-3 text-indigo-600" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default InsightsPage
