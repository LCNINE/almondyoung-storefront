import { Suspense } from "react"
import { WishlistChatActionsWrapper } from "../../templates/product-actions-wrappers/wishlist-chat-actions-wrapper"
import { WishlistButton } from "../actions/wishlist-button"
import { RatingActionsWrapper } from "../../templates/product-actions-wrappers/rating-actions-wrapper"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@/lib/utils/get-product-price"
import { PriceDisplay } from "../price-display"

function RatingSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-1.5 py-1">
      <div className="flex gap-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-gray-10 h-4 w-4 rounded-sm" />
        ))}
      </div>
      <div className="bg-gray-10 h-4 w-6 rounded" />
      <div className="bg-gray-10 h-4 w-px" />
      <div className="bg-gray-10 h-4 w-16 rounded" />
    </div>
  )
}

interface Props {
  brand: string
  productName: string
  product: HttpTypes.StoreProduct
  countryCode: string
  handle: string
}

export function SideBar({
  brand,
  productName,
  product,
  countryCode,
  handle,
}: Props) {
  const { cheapestPrice } = getProductPrice({
    product,
  })
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

        {cheapestPrice && <PriceDisplay price={cheapestPrice} />}
      </div>
    </aside>
  )
}
