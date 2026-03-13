import { Suspense } from "react"
import RefinementList from "../components2/refinement-list"
import { SortOptions } from "../components2/refinement-list/sort-products"
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
    <div
      className="small:flex-row small:items-start content-container flex flex-col py-6"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="text-2xl-semi mb-8">
          <h1 data-testid="store-page-title">All products</h1>
        </div>
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
