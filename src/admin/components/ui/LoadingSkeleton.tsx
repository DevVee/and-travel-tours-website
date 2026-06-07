import { cn } from '@lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('bg-gray-200 animate-pulse rounded-lg', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-50">
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-3.5 w-36" />
      <Skeleton className="h-3.5 w-24 ml-auto" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonKanban() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array.from({ length: 5 }).map((_, col) => (
        <div key={col} className="flex-shrink-0 w-72 space-y-3">
          <Skeleton className="h-8 w-full rounded-xl" />
          {Array.from({ length: 3 }).map((_, card) => (
            <SkeletonCard key={card} />
          ))}
        </div>
      ))}
    </div>
  )
}
