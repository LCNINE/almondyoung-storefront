import LocalizedClientLink from "@/components/shared/localized-client-link"
import { getProductPrice } from "@/lib/utils/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./price"
import Thumbnail from "../thumbnail"

export default async function ProductCard({
  product,
  isMembership,
  isMembershipOnly,
}: {
  product: HttpTypes.StoreProduct
  isMembership: boolean
  isMembershipOnly: boolean
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
        />

        <div className="mt-4">
          <h3 className="line-clamp-1 text-[14px] leading-tight text-gray-600">
            {product.title}
          </h3>

          <div className="flex flex-col gap-3">
            {cheapestPrice && (
              <ProductPrice
                price={cheapestPrice}
                membershipPrice={
                  product.variants?.[0]?.metadata?.membershipPrice as number
                }
                isMembership={isMembership}
                isMembershipOnly={isMembershipOnly}
              />
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
