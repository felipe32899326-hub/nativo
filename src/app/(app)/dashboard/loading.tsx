import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-9 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
