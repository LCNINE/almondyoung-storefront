import { ReviewListHeader } from "./review-list-header"
import { ReviewFilters } from "./review-filters"
import { ReviewFormCard } from "./review-form-card"
import type { WrittenReview } from "../types"

interface WrittenReviewsSectionProps {
  reviews: WrittenReview[]
  onUpdate: (
    reviewId: string,
    data: { rating: number; text: string }
  ) => Promise<void>
  onDelete: (reviewId: string) => void
}

/**
 * 작성된 리뷰 섹션 컴포넌트
 * 조합 패턴을 사용하여 Props Drilling 해결
 */
export const WrittenReviewsSection = ({
  reviews,
  onUpdate,
  onDelete,
}: WrittenReviewsSectionProps) => {
  return (
    <section>
      <ReviewListHeader title="리뷰" count={reviews.length}>
        <ReviewFilters />
      </ReviewListHeader>

      <ul className="flex flex-col gap-4">
        {reviews.map((review) => (
          <li key={review.id}>
            <ReviewFormCard
              product={review.productInfo}
              review={review.reviewData}
              onSave={(data) => onUpdate(review.id, data)}
              onDelete={() => onDelete(review.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
