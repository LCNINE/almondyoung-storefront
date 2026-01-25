"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckoutMembershipTagIcon } from "@/icons/membership-tag-icon"
import {
  addPromotionToCart,
  removePromotionFromCart,
} from "@/lib/api/medusa/store"
import type { Promotion } from "@/lib/types/ui/promotion"
import { formatPrice } from "@/lib/utils/price-utils"
import type { HttpTypes } from "@medusajs/types"
import { useCallback, useState, useTransition } from "react"

interface DiscountSectionProps {
  cartId: string
  isMembership: boolean
  membershipDiscount: number
  promotions: Promotion[]
  appliedPromotionCode?: string | null
  availablePoints?: number
  onPointsChange?: (points: number) => void
  onCouponApplied?: () => void
}

/** 멤버십 할인 금액 계산 (compare_at_unit_price - unit_price) * quantity */
export const calculateMembershipDiscount = (
  items: HttpTypes.StoreCartLineItem[]
): number => {
  return items.reduce((acc, item) => {
    const compareAtPrice = item.compare_at_unit_price ?? item.unit_price
    const discount = (compareAtPrice - item.unit_price) * item.quantity
    return acc + Math.max(0, discount)
  }, 0)
}

export const DiscountSection = ({
  cartId,
  isMembership = false,
  membershipDiscount,
  promotions,
  appliedPromotionCode,
  availablePoints = 0,
  onPointsChange,
  onCouponApplied,
}: DiscountSectionProps) => {
  // 적립금 입력값
  const [pointsInput, setPointsInput] = useState("0")
  // 실제 사용할 적립금
  const [pointsUsed, setPointsUsed] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [selectedCoupon, setSelectedCoupon] = useState<string>(
    appliedPromotionCode ?? ""
  )

  // 숫자만 추출하는 함수
  const parseNumber = (value: string): number => {
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10)
    return isNaN(num) ? 0 : num
  }

  const handleCouponChange = useCallback(
    (code: string) => {
      startTransition(async () => {
        try {
          // 기존 쿠폰이 있으면 제거
          if (selectedCoupon) {
            await removePromotionFromCart(cartId, [selectedCoupon])
          }
          // 새 쿠폰 적용
          if (code) {
            await addPromotionToCart(cartId, [code])
          }
          setSelectedCoupon(code)
          onCouponApplied?.()
        } catch (error) {
          console.error("쿠폰 적용 실패:", error)
        }
      })
    },
    [cartId, selectedCoupon, onCouponApplied]
  )

  const handleCouponRemove = useCallback(() => {
    if (!selectedCoupon) return

    startTransition(async () => {
      try {
        await removePromotionFromCart(cartId, [selectedCoupon])
        setSelectedCoupon("")
        onCouponApplied?.()
      } catch (error) {
        console.error("쿠폰 제거 실패:", error)
      }
    })
  }, [cartId, selectedCoupon, onCouponApplied])

  const handlePointsInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const numericValue = parseNumber(rawValue)

      // 사용 가능 금액 초과 방지
      const clampedValue = Math.min(numericValue, availablePoints)

      setPointsInput(clampedValue === 0 ? "0" : formatPrice(clampedValue))
      setPointsUsed(clampedValue)
      onPointsChange?.(clampedValue)
    },
    [availablePoints, onPointsChange]
  )

  // 전액사용 핸들러
  const handleUseAll = useCallback(() => {
    setPointsInput(availablePoints === 0 ? "0" : formatPrice(availablePoints))
    setPointsUsed(availablePoints)
    onPointsChange?.(availablePoints)
  }, [availablePoints, onPointsChange])

  // 총 할인 금액 = 멤버십 할인 + 적립금 사용 (쿠폰은 cart에서 계산됨)
  const totalDiscount = membershipDiscount + pointsUsed

  return (
    <section aria-labelledby="discount-heading" className="mb-8">
      <h2
        id="discount-heading"
        className="mb-3 text-base font-bold text-gray-900 md:text-xl"
      >
        할인 / 부가결제
      </h2>

      <div className="flex w-full flex-col gap-5 rounded-md border border-gray-200 bg-white p-4 md:gap-6 md:rounded-[10px] md:p-6">
        {/* 자동할인 - 총 할인 금액 표시 */}
        <DiscountRow
          label="자동할인"
          isMembership={isMembership}
          totalDiscount={totalDiscount}
          membershipDiscount={membershipDiscount}
        />

        <hr className="border-t border-gray-100" />

        {/* 쿠폰 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 md:text-sm">
              쿠폰
            </span>
            <span className="text-xs text-gray-500 md:text-sm">
              사용가능 {promotions.length > 0 && `(${promotions.length})`}
            </span>
          </div>

          {/* 적용된 쿠폰이 있을 때 */}
          {selectedCoupon ? (
            <div className="flex items-center justify-between rounded-[5px] border border-[#F29219] bg-[#FFF7E5] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#F29219] md:text-sm">
                  {(() => {
                    const promo = promotions.find(
                      (p) => p.code === selectedCoupon
                    )
                    if (!promo) return selectedCoupon
                    return promo.application_method.type === "percentage"
                      ? `${promo.application_method.value}% 할인`
                      : `${formatPrice(promo.application_method.value)}원 할인`
                  })()}
                </span>
                <span className="text-[10px] text-gray-500 md:text-xs">
                  ({selectedCoupon})
                </span>
              </div>
              <button
                type="button"
                onClick={handleCouponRemove}
                disabled={isPending}
                className="flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="쿠폰 제거"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>
          ) : (
            /* 쿠폰 선택 드롭다운 */
            <Select
              value={selectedCoupon}
              onValueChange={handleCouponChange}
              disabled={promotions.length === 0 || isPending}
            >
              <SelectTrigger className="h-10 w-full rounded-[5px] border-gray-200 bg-white text-xs text-gray-500 focus:border-gray-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                <SelectValue
                  placeholder={
                    isPending
                      ? "쿠폰 적용 중..."
                      : promotions.length === 0
                        ? "사용 가능한 쿠폰이 없습니다"
                        : `쿠폰을 선택해주세요 (${promotions.length})`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {promotions.map((promo) => (
                  <SelectItem key={promo.id} value={promo.code}>
                    {promo.application_method.type === "percentage"
                      ? `${promo.application_method.value}% 할인`
                      : `${formatPrice(promo.application_method.value)}원 할인`}
                    {promo.code && ` (${promo.code})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <hr className="border-t border-gray-100" />

        {/* 적립금 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 md:text-sm">
              적립금
            </span>
            <span className="text-xs text-gray-500 md:text-sm">
              보유:{" "}
              <span className="font-semibold text-gray-900">
                {formatPrice(availablePoints)}원
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-500">
                사용
              </span>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={pointsInput}
                onChange={handlePointsInputChange}
                disabled={availablePoints === 0}
                className="h-9 w-full rounded-[5px] border border-gray-200 pr-8 pl-10 text-right text-sm font-semibold text-[#F29219] placeholder-gray-300 focus:border-[#F29219] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 md:h-10"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-[#F29219]">
                원
              </span>
            </div>
            <button
              type="button"
              onClick={handleUseAll}
              disabled={availablePoints === 0}
              className="shrink-0 rounded-[5px] bg-[#FFF7E5] px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-[#FFE8B3] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 md:text-sm"
            >
              전액사용
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

interface DiscountRowProps {
  label: string
  isMembership: boolean
  totalDiscount: number
  membershipDiscount: number
}

const DiscountRow = ({
  label,
  isMembership,
  totalDiscount,
  membershipDiscount,
}: DiscountRowProps) => {
  const hasMembershipDiscount = isMembership && membershipDiscount > 0
  const hasDiscount = totalDiscount > 0

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-900 md:text-sm">
          {label}
        </span>

        {/* 멤버십 할인인 경우에만 할인 유형 표시 */}
        {hasMembershipDiscount && (
          <div className="flex items-center gap-1">
            <CheckoutMembershipTagIcon />
            <span className="text-[10px] font-medium text-[#E08F00] md:text-xs">
              멤버십 할인 -{formatPrice(membershipDiscount)}원
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        {/* 총 할인 금액 표시 */}
        <span className="text-sm font-semibold text-gray-900 md:text-base">
          {hasDiscount ? `-${formatPrice(totalDiscount)}원` : "0원"}
        </span>
      </div>
    </div>
  )
}
