import { VariantPrice } from "@/lib/types/common/price"
import { BadgePercent } from "lucide-react"

interface Props {
  price: VariantPrice
}

export function PriceDisplay({ price }: Props) {
  if (!price) return null

  const isSale = price.price_type === "sale"

  if (!isSale) {
    return (
      <div className="py-2">
        <span className="text-2xl font-bold">{price.calculated_price}</span>
      </div>
    )
  }

  return (
    <div className="py-2">
      {/* 멤버십 할인가 라벨 */}
      <div className="mb-1 flex items-center gap-1">
        <BadgePercent className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">멤버십 할인가</span>
      </div>

      {/* 원가 (취소선) */}
      <p className="text-sm text-muted-foreground line-through">
        {price.original_price}
      </p>

      {/* 할인율 + 판매가 */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-primary">
          {price.percentage_diff}%
        </span>
        <span className="text-2xl font-bold">
          {price.calculated_price}
        </span>
      </div>
    </div>
  )
}
