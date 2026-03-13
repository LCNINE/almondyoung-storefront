import LocalizedClientLink from "@/components/shared/localized-client-link"
import { getProductPrice } from "@/lib/utils/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "./price"
import Thumbnail from "../thumbnail"

export default async function ProductCard({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
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
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="txt-compact-medium mt-4 flex justify-between">
          <p className="text-ui-fg-subtle">{product.title}</p>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && (
              <ProductPrice
                price={cheapestPrice}
                membershipPrice={
                  product.variants?.[0]?.metadata?.membershipPrice as number
                }
              />
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
