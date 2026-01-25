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
import type { Promotion } from "@/lib/types/ui/promotion"
import { formatPrice } from "@/lib/utils/price-utils"
import type { HttpTypes } from "@medusajs/types"

interface DiscountSectionProps {
  isMembership: boolean
  membershipDiscount: number
  promotions: Promotion[]
  couponDiscount?: number
  pointsUsed?: number
  availablePoints?: number
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
  isMembership = false,
  membershipDiscount,
  promotions,
  couponDiscount = 0,
  pointsUsed = 0,
  availablePoints = 0,
}: DiscountSectionProps) => {
  // 총 할인 금액 = 멤버십 할인 + 쿠폰 할인 + 적립금 사용
  const totalDiscount = membershipDiscount + couponDiscount + pointsUsed

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
          <Select disabled={promotions.length === 0}>
            <SelectTrigger className="h-10 w-full rounded-[5px] border-gray-200 bg-white text-xs text-gray-500 focus:border-gray-400 focus:ring-0 md:text-sm">
              <SelectValue
                placeholder={
                  promotions.length === 0
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
        </div>

        <hr className="border-t border-gray-100" />

        {/* 적립금 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-900 md:text-sm">
              적립금
            </span>
            <span className="text-xs text-gray-500 md:text-sm">
              보유:
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
                placeholder="0원"
                className="h-9 w-full rounded-[5px] border border-gray-200 pr-3 pl-10 text-right text-sm font-semibold text-[#F29219] placeholder-gray-300 focus:border-[#F29219] focus:outline-none md:h-10"
                defaultValue="0원"
              />
            </div>
            <button
              type="button"
              className="shrink-0 rounded-[5px] bg-[#FFF7E5] px-4 py-2 text-xs font-bold text-gray-900 transition-colors hover:bg-[#FFE8B3] md:text-sm"
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
