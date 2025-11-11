import { TrendingUp, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FolderInsight } from '@/lib/ai-api'

interface FeaturedFoldersProps {
  folders: FolderInsight[]
  isLoading: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
  onRefresh: () => void
}

export function FeaturedFolders({
  folders,
  isLoading,
  onScrollLeft,
  onScrollRight,
  onRefresh,
}: FeaturedFoldersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Featured Folders</h2>
          <span className="text-sm text-slate-500">AI-identified important locations</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onScrollLeft}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onScrollRight}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <FeaturedFoldersSkeleton />
      ) : (
        <div 
          id="featured-scroll"
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
          style={{ scrollbarWidth: 'thin' }}
        >
          {folders.map((folder) => (
            <FolderCard key={folder.folderPath} folder={folder} />
          ))}
        </div>
      )}
    </div>
  )
}

function FeaturedFoldersSkeleton() {
  return (
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
  )
}

interface FolderCardProps {
  folder: FolderInsight
}

function FolderCard({ folder }: FolderCardProps) {
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
    <div
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
  )
}
