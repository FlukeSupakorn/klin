import { Sparkles, FileCheck, Copy, AlertTriangle, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useActivityStore } from '@/pages/activity/store/useActivityStore'

export function AIInsightsWidget() {
  const navigate = useNavigate()
  const history = useActivityStore((state) => state.history)

  // Calculate organized files
  const organizedFiles = history.filter(item => item.action === 'approved').length

  // Calculate duplicates removed
  const duplicatesRemoved = history.filter(item => item.tag === 'duplicated').length

  // Mock duplicate stats (in production, this would come from a file health scan)
  const totalDuplicates = Math.max(0, 5 - duplicatesRemoved) // Mock: starts at 5
  const wastedSpace = totalDuplicates * 2.5 * 1024 * 1024 // Mock: ~2.5MB per duplicate
  
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
  }

  // Calculate health score (0-100)
  const getHealthScore = () => {
    if (totalDuplicates === 0) return 100
    // Arbitrary formula: reduce score based on duplicates
    const score = Math.max(0, 100 - (totalDuplicates * 2))
    return Math.round(score)
  }

  const healthScore = getHealthScore()
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-indigo-900">AI Insights</h2>
          <p className="text-xs text-indigo-600">Smart file analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {/* Organized Files */}
        <button
          onClick={() => navigate('/history')}
          className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg group-hover:scale-110 transition-transform">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-blue-500 opacity-50" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-blue-900">{organizedFiles}</p>
            <p className="text-xs font-medium text-blue-700">Files Organized</p>
            <p className="text-xs text-blue-600/70">Successfully processed</p>
          </div>
        </button>

        {/* Duplicates Removed */}
        <button
          onClick={() => navigate('/file-health')}
          className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg group-hover:scale-110 transition-transform">
              <Copy className="h-5 w-5 text-orange-600" />
            </div>
            <TrendingUp className="h-4 w-4 text-orange-500 opacity-50" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-orange-900">{duplicatesRemoved}</p>
            <p className="text-xs font-medium text-orange-700">Duplicates Removed</p>
            <p className="text-xs text-orange-600/70">Space saved</p>
          </div>
        </button>

        {/* File Health Summary */}
        <button
          onClick={() => navigate('/file-health')}
          className="w-full bg-gradient-to-br from-white/90 to-indigo-50/50 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-300 transition-all group text-left"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getHealthBgColor(healthScore)} group-hover:scale-110 transition-transform`}>
                <AlertTriangle className={`h-5 w-5 ${getHealthColor(healthScore)}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-indigo-700">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getHealthBgColor(healthScore)} ${getHealthColor(healthScore)}`}>
                {healthScore >= 80 ? '✓ Good' : healthScore >= 60 ? '⚠ Fair' : '✗ Poor'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-2 border-t border-indigo-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-600">Duplicates Found</span>
              <span className="font-semibold text-indigo-900">{totalDuplicates}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-600">Wasted Space</span>
              <span className="font-semibold text-indigo-900">{formatBytes(wastedSpace)}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-600">Status</span>
              <span className="font-semibold text-indigo-900">
                {totalDuplicates > 0 ? `${totalDuplicates} found` : 'Clean'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-indigo-100">
            <div className="flex items-center gap-2 text-xs text-indigo-600">
              <Sparkles className="h-3 w-3" />
              <span>Click to view detailed health report →</span>
            </div>
          </div>
        </button>

        {/* Quick Tip */}
        <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/80 backdrop-blur-sm border border-purple-200/50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-900 mb-1">Quick Tip</p>
              <p className="text-xs text-purple-700 leading-relaxed">
                {totalDuplicates > 0 
                  ? `You have ${totalDuplicates} duplicate files. Run File Health scan to clean them up and free ${formatBytes(wastedSpace)}.`
                  : organizedFiles > 0
                  ? 'Great job! Your files are well organized. Keep it up!'
                  : 'Start organizing your files to see insights and analytics here.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
