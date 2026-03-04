import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"
import { RatingActionsWrapper } from "../../templates/product-actions-wrappers/rating-actions-wrapper"
import { WishlistChatActionsWrapper } from "../../templates/product-actions-wrappers/wishlist-chat-actions-wrapper"
import { WishlistButton } from "../actions/wishlist-button"
import { RatingSkeleton } from "@/components/skeletons/product-detail-skeletons"
import ProductActions from "../../templates/product-actions-wrappers/product-actions"

interface Props {
  brand: string
  productName: string
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  handle: string
}

export function SideBar({
  brand,
  productName,
  product,
  region,
  countryCode,
  handle,
}: Props) {
  return (
    <aside className="hidden w-full min-w-[383px] overflow-y-auto lg:sticky lg:top-0 lg:block lg:max-h-screen lg:max-w-[480px]">
      <div className="bg-background h-full p-6">
        <header className="flex justify-between gap-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{brand}</p>

            <h2 className="text-xl font-bold">{productName}</h2>
          </div>

          <div className="flex gap-2">
            <Suspense
              fallback={
                <>
                  <WishlistButton
                    productId={product.id}
                    isWishlisted={false}
                    countryCode={countryCode}
                  />
                </>
              }
            >
              <WishlistChatActionsWrapper
                productId={product.id}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </header>

        <Suspense fallback={<RatingSkeleton />}>
          <RatingActionsWrapper handle={handle} />
        </Suspense>

        <Suspense>
          <ProductActions product={product} region={region} />
        </Suspense>
      </div>
    </aside>
  )
}
