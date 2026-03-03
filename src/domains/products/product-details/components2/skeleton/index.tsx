import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailInfoSkeleton() {
  return (
    <div className="space-y-8">
      {/* 상품정보 테이블 */}
      <div>
        <Skeleton className="mb-4 h-6 w-20" />
        <div className="grid grid-cols-2 gap-x-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b py-3">
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
          {/* 소재, 사용방법 - 전체 너비 */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`full-${i}`} className="col-span-2 border-b py-3">
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* 상세 이미지 영역 */}
      <Skeleton className="aspect-square w-full rounded-lg" />
    </div>
  )
}
