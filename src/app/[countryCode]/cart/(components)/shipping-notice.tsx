import React from "react"
import { Truck } from "lucide-react"

const FREE_SHIPPING_THRESHOLD = 50000 // 무료배송 기준금액

interface ShippingNoticeProps {
  shippingTotal: number
  selectedTotal: number // 선택된 상품의 총 금액
  variant?: "mobile" | "desktop"
}

export function ShippingNotice({
  shippingTotal,
  selectedTotal,
  variant = "mobile",
}: ShippingNoticeProps) {
  // 무료배송 달성 여부
  const isFreeShipping = selectedTotal >= FREE_SHIPPING_THRESHOLD
  // 프로그레스 퍼센트 (최대 100%)
  const progressPercent = Math.min(
    (selectedTotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  )
  // 무료배송까지 남은 금액
  const remainingAmount = Math.max(FREE_SHIPPING_THRESHOLD - selectedTotal, 0)

  // 상태 라벨
  const statusLabel = isFreeShipping
    ? "무료배송"
    : `배송비 ${shippingTotal.toLocaleString()}원`

  // 안내 메시지
  const guideMessage = isFreeShipping
    ? "무료배송 조건을 충족했습니다!"
    : `${remainingAmount.toLocaleString()}원 추가 시 무료배송 (결제금액 기준)`

  if (variant === "mobile") {
    return (
      <aside className="shipping-notice" role="complementary">
        <div className="rounded-lg py-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold">{statusLabel}</span>
            <span className="text-muted-foreground text-sm">
              {guideMessage}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="absolute h-2 rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div
              className={isFreeShipping ? "text-amber-400" : "text-gray-300"}
            >
              <Truck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </aside>
    )
  }

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{statusLabel}</span>
        <span className="text-muted-foreground text-sm">{guideMessage}</span>
      </div>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-2.5 rounded-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className={isFreeShipping ? "text-amber-400" : "text-gray-300"}>
          <Truck className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
