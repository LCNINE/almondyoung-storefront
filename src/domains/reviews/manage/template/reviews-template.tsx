import { PageTitle } from "@/components/shared/page-title"
import { getOrders } from "@lib/api/medusa/orders"
import { ReviewsTabs } from "../components/reviews-tabs"
import type { WritableReview } from "../types"

export const ReviewsTemplate = async () => {
  const ordersData = await getOrders({ limit: 50, status: "completed" })

  // 배송 완료된 주문에서 리뷰 작성 가능한 상품 추출
  const writableReviews: WritableReview[] =
    ordersData?.orders?.flatMap(
      (order) =>
        order.items?.map((item) => ({
          id: item.id,
          orderId: order.id,
          productId: item.variant?.product_id || item.product_id || "",
          productName: item.title || item.variant?.product?.title || "상품",
          productImage:
            item.thumbnail ||
            item.variant?.product?.thumbnail ||
            "https://placehold.co/80x80",
          orderDate: String(order.updated_at || ""),
          variantTitle: item.variant?.title || "",
        })) ?? []
    ) ?? []

  // TODO: 작성된 리뷰는 UGC 서비스에서 조회
  // 현재는 사용자별 리뷰 조회 API가 없으므로 빈 배열
  const writtenReviews: [] = []

  return (
    <main className="bg-white px-3 py-4 md:min-h-screen md:px-6">
      <PageTitle>리뷰</PageTitle>
      <ReviewsTabs
        writableReviews={writableReviews}
        writtenReviews={writtenReviews}
      />
    </main>
  )
}
