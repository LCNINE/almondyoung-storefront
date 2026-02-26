import { Suspense } from "react"
import { WishlistChatActionsWrapper } from "../../templates/product-actions-wrappers/wishlist-chat-actions-wrapper"

interface Props {
  brand: string
  productName: string
  productId: string
  countryCode: string
}

export function SideBar({ brand, productName, productId, countryCode }: Props) {
  return (
    <aside className="hidden w-full min-w-[383px] overflow-y-auto lg:sticky lg:top-0 lg:block lg:max-h-screen lg:max-w-[480px]">
      <div className="bg-background h-full p-6">
        <header className="flex justify-between gap-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600">{brand}</p>

            <h2 className="text-xl font-bold">{productName}</h2>
          </div>

          <div className="flex gap-2">
            <Suspense fallback={<div>Loading...</div>}>
              <WishlistChatActionsWrapper productId={productId} countryCode={countryCode} />
            </Suspense>
          </div>
        </header>
      </div>
    </aside>
  )
}
