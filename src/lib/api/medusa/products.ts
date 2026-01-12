"use server"

import { sdk } from "@/lib/config/medusa"
import type { ProductsResponseDto } from "@lib/types/dto/medusa"

import type { StoreProduct } from "@medusajs/types"

interface GetProductListParams {
  page?: number
  limit?: number
  categoryId?: string
  country_code?: string
}

// 상품 목록 조회
export const getProductList = async ({
  page = 1,
  limit = 10,
  categoryId,
  country_code = "kr",
}: GetProductListParams): Promise<ProductsResponseDto> => {
  const offset = (page - 1) * limit

  try {
    const {
      products,
      count,
      limit: resLimit,
    } = await sdk.store.product.list(
      {
        limit,
        offset,
        category_id: categoryId,
        fields: "*variants.calculated_price,+categories,+metadata,+tags",
        country_code: country_code,
      },
      {
        next: {
          tags: ["products", categoryId || ""],
        },
      }
    )

    const totalPages = Math.ceil(count / resLimit)

    return {
      products,
      count,
      totalPages,
      currentPage: page,
    }
  } catch (error) {
    console.error("상품 목록 로드 실패:", error)
    throw error
  }
}
// 상품 상세 조회
export const getProductDetail = async (
  productId: string
): Promise<StoreProduct> => {
  try {
    const { product } = await sdk.store.product.retrieve(productId, {
      fields: "*variants.calculated_price",
    })

    return product
  } catch (error) {
    console.error("상품 상세 조회 실패:", error)
    throw error
  }
}
