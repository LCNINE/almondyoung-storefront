"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { deleteLineItem, updateLineItem } from "@/lib/api/medusa/cart"
import { formatPrice } from "@/lib/utils/format-price"
import { StoreCart, StoreCartLineItem } from "@medusajs/types"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import { useState, useTransition } from "react"
import { toast } from "sonner"

interface OrderProductsSectionProps {
  products: StoreCart["items"]
  shippingFee: number
}

export const OrderProductsSection = ({
  products,
  shippingFee,
}: OrderProductsSectionProps) => {
  if (!products?.length) {
    return (
      <section aria-labelledby="order-heading" className="mb-8">
        <h2
          id="order-heading"
          className="mb-3 text-base font-bold text-gray-900 md:text-xl"
        >
          주문 상품
        </h2>
        <article className="rounded-md border border-gray-200 bg-white p-4 md:rounded-[10px] md:p-10">
          <p className="text-center text-gray-500">주문 상품이 없습니다.</p>
        </article>
      </section>
    )
  }

  return (
    <section aria-labelledby="order-heading" className="mb-8">
      <h2
        id="order-heading"
        className="mb-3 text-base font-bold text-gray-900 md:text-xl"
      >
        주문 상품
      </h2>
      <article className="rounded-md border border-gray-200 bg-white px-[14px] py-[18px] md:rounded-[10px] md:px-10 md:py-8">
        <div className="space-y-4">
          {products.map((item, i) => (
            <ProductItem
              key={item.id}
              item={item}
              showDivider={i < products.length - 1}
            />
          ))}
        </div>
        <p className="mt-4 text-right text-[12px] text-gray-600 md:mt-6 md:text-sm">
          배송비 {formatPrice(shippingFee)}원
        </p>
      </article>
    </section>
  )
}

function ProductItem({
  item,
  showDivider,
}: {
  item: StoreCartLineItem
  showDivider: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const {
    thumbnail,
    product_title,
    title,
    variant_title,
    subtitle,
    quantity,
    unit_price,
    compare_at_unit_price,
    original_total,
    total,
    id,
  } = item

  const productTitle = product_title ?? title
  const price = total ?? unit_price * quantity
  const originalPrice = compare_at_unit_price ?? original_total
  const hasDiscount = !!(originalPrice && originalPrice > price)

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteLineItem(id)
        toast.success("상품이 삭제되었습니다.")
      } catch {
        toast.error("상품 삭제에 실패했습니다.")
      }
    })
  }

  return (
    <div className={showDivider ? "border-b border-gray-100 pb-4" : ""}>
      <div className="flex items-start gap-3 md:gap-4">
        <Image
          src={thumbnail ?? "https://placehold.co/400"}
          alt={productTitle}
          width={64}
          height={64}
          className="h-[52px] w-[52px] rounded-[2px] object-cover md:h-[64px] md:w-[64px] md:rounded-[5px]"
        />
        <p className="flex-1 text-[12px] text-gray-900 md:text-sm">
          {productTitle}
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>상품 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                {title} 이 상품을 장바구니에서 삭제하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                className="bg-yellow-30 hover:bg-yellow-40"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "삭제중..." : "삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between rounded-[2px] bg-[#F5F5F5]/50 px-2 py-2 md:px-3 md:py-2.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-[2px] border-gray-200 bg-white px-1 py-0 text-[11px] font-medium text-gray-600"
            >
              옵션
            </Badge>
            <span className="text-[12px] text-gray-600 md:text-sm">
              {variant_title ?? subtitle ?? "기본"} | {quantity}개
            </span>
          </div>
          <div className="flex items-center gap-2">
            <QuantityEditPopover
              itemId={id}
              currentQuantity={quantity}
              unitPrice={unit_price}
            />
            <PriceDisplay
              hasDiscount={hasDiscount}
              originalPrice={originalPrice}
              price={price}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuantityEditPopover({
  itemId,
  currentQuantity,
  unitPrice,
}: {
  itemId: string
  currentQuantity: number
  unitPrice: number
}) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState(currentQuantity)
  const [isPending, startTransition] = useTransition()

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setQuantity(currentQuantity)
    setOpen(isOpen)
  }

  const handleSave = () => {
    if (quantity === currentQuantity) return setOpen(false)
    startTransition(async () => {
      try {
        await updateLineItem({ lineId: itemId, quantity })
        toast.success("수량이 변경되었습니다.")
        setOpen(false)
      } catch {
        toast.error("수량 변경에 실패했습니다.")
      }
    })
  }

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 text-[11px] text-gray-600"
        >
          변경
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 space-y-3 p-3">
        <p className="text-sm font-medium">수량 변경</p>
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isPending || quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[40px] text-center text-lg font-medium">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-center text-sm text-gray-500">
          예상 금액:{" "}
          <span className="font-medium text-gray-900">
            {formatPrice(unitPrice * quantity)}원
          </span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            취소
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? "저장중..." : "저장"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PriceDisplay({
  hasDiscount,
  originalPrice,
  price,
}: {
  hasDiscount: boolean
  originalPrice?: number
  price: number
}) {
  return (
    <div className="flex items-center gap-1.5 text-right">
      {hasDiscount && (
        <span className="text-[12px] text-gray-400 line-through md:text-sm">
          {formatPrice(originalPrice)}
        </span>
      )}
      <span className="text-[13px] font-medium text-gray-900 md:text-base">
        {formatPrice(price)}원
      </span>
    </div>
  )
}
