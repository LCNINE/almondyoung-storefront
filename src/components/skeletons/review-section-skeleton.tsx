import { Skeleton } from "@/components/ui/skeleton"

export function ReviewSectionSkeleton() {
  return (
    <div className="space-y-4 py-6">
      <Skeleton className="h-4 w-40" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`review-skeleton-${index}`}
            className="rounded-lg border border-gray-100 p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
