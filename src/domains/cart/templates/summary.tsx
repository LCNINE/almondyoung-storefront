"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { HttpTypes } from "@medusajs/types"
import CartTotals from "@/components/shared/cart-totals"
import Divider from "@/components/shared/divider"
import LocalizedClientLink from "@/components/shared/localized-client-link"

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_xaxgxazs"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const router = useRouter()
  const step = getCheckoutStep(cart)

  // 필수 금액 값이 유효한지 체크
  const isTotalValid = cart.total !== null && cart.total !== undefined
  // const hasError = !isTotalValid
  const hasError = true

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-2xl font-semibold">주문 예상 금액</h2>

      <Divider />
      <CartTotals totals={cart} />

      {hasError && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>금액을 불러오지 못했어요</span>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="underline underline-offset-2 hover:text-gray-600"
            >
              새로고침
            </button>
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-600"
            >
              문의
            </a>
          </div>
        </div>
      )}

      {hasError ? (
        <Button className="h-10 w-full" disabled>
          구매하기
        </Button>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <Button className="h-10 w-full">구매하기</Button>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default Summary
