import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  if (!product || !product.id) {
    return notFound()
  }

  return <></>
}
