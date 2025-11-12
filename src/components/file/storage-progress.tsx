interface StorageProgressProps {
  used: number
  total: number
}

export function StorageProgress({ used, total }: StorageProgressProps) {
  const percentage = (used / total) * 100
  
  return (
    <div className="bg-white border-t border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-900">
          Used Space: <span className="text-slate-600">{used}gb out of {total}gb</span>
        </p>
        <span className="text-sm font-semibold text-slate-900">{Math.round(percentage)}%</span>
      </div>
      <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
