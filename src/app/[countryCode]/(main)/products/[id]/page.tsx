import { getProductDetail, listProducts } from "@lib/api/medusa/products"
import { getRegion } from "@lib/api/medusa/regions"
import { getProductDetailByMasterId } from "@lib/api/pim/products"
import { fetchMe } from "@lib/api/users/me"
import { getWishlistByProductId } from "@lib/api/users/wishlist"
import { ProductDetail } from "@lib/types/ui/product"
import type { UserDetail, WishlistItem } from "@lib/types/ui/user"
import {
  getPricesForVariant,
  getProductPrice,
} from "@lib/utils/get-product-price"
import type { StoreProduct } from "@medusajs/types"
import ProductDetailPage from "domains/products/product-details/product-detail-page"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string; id: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title}`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title}`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

const mapProductMetadata = (metadata?: Record<string, unknown>) => {
  if (!metadata) return undefined

  return Object.entries(metadata).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value == null) return acc
      acc[key] = typeof value === "string" ? value : String(value)
      return acc
    },
    {}
  )
}

const buildSelectionKey = (
  selection: Record<string, string>,
  optionOrder: string[]
) => {
  if (optionOrder.length === 0) return undefined

  const parts = optionOrder.map((label) => {
    const value = selection[label]
    return value ? `${label}=${value}` : ""
  })

  if (parts.some((part) => !part)) return undefined

  return parts.join("|")
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; countryCode: string }>
}) {
  const { id, countryCode } = await params
  let product: ProductDetail | null = null
  let error: string | null = null

  return (
    <div className="md:bg-muted/50 min-h-screen bg-white">
      <ProductDetailPage
        params={Promise.resolve({ id, countryCode })}
        product={product}
        wishlist={wishlist}
        error={error}
        user={user}
      />
    </div>
  )
}
