import { Skeleton } from '@/components/ui/skeleton'

interface FileSkeletonProps {
  count?: number
}

// Skeleton for Grid View
export function GridSkeleton({ count = 4 }: FileSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-4 space-y-3"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for List View
export function ListSkeleton({ count = 4 }: FileSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton for Tab View
export function TabSkeleton({ count = 4 }: FileSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-3"
        >
          <Skeleton className="h-5 w-5 rounded self-start" />
          <Skeleton className="h-16 w-16 rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  )
}

// Loading More Skeleton (smaller, shown at bottom)
export function LoadingMoreSkeleton({ view }: { view: 'tab' | 'grid' | 'list' }) {
  const count = 4

  if (view === 'grid') {
    return <GridSkeleton count={count} />
  }

  if (view === 'list') {
    return <ListSkeleton count={count} />
  }

  return <TabSkeleton count={count} />
}
