import { Suspense } from "react"
import RefinementList from "../components/refinement-list"
import { SortOptions } from "../components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"

export function CategoryTemplate({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="container mx-auto">
      <div className="flex justify-end">
        <RefinementList sortBy={sort} />
      </div>

      <div className="w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
