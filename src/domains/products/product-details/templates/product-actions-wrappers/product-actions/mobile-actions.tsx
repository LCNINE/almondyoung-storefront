"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { getProductPrice } from "@/lib/utils/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { ChevronDown, X } from "lucide-react"
import React, { useMemo, useState } from "react"
import OptionSelect from "./option-select"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (optionId: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isPending?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isPending,
  show,
  optionsDisabled,
}) => {
  const [open, setOpen] = useState(false)

  const price = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = useMemo(() => {
    if (!price) return null
    const { variantPrice, cheapestPrice } = price
    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = product.variants?.length === 1

  return (
    <>
      {/* 하단 고정 바 */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-999 transition-all duration-300 lg:hidden",
          show
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0"
        )}
      >
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-y-3 border-t border-gray-200 bg-white p-4"
          data-testid="mobile-actions"
        >
          <div className="flex items-center gap-x-2">
            <span className="text-sm font-medium" data-testid="mobile-title">
              {product.title}
            </span>
            <span className="text-gray-300">—</span>
            {selectedPrice ? (
              <div className="flex items-end gap-x-2">
                {selectedPrice.price_type === "sale" && (
                  <span className="text-sm text-gray-400 line-through">
                    {selectedPrice.original_price}
                  </span>
                )}
                <span
                  className={cn(
                    "text-sm font-bold",
                    selectedPrice.price_type === "sale" && "text-red-500"
                  )}
                >
                  {selectedPrice.calculated_price}
                </span>
              </div>
            ) : (
              <div />
            )}
          </div>
          <div
            className={cn("grid w-full grid-cols-2 gap-x-4", {
              "grid-cols-1!": isSimple,
            })}
          >
            {!isSimple && (
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="w-full"
                data-testid="mobile-actions-button"
              >
                <div className="flex w-full items-center justify-between">
                  <span>
                    {variant ? Object.values(options).join(" / ") : "옵션 선택"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            )}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant || isPending}
              className="w-full"
              data-testid="mobile-cart-button"
            >
              {isPending
                ? "담는 중..."
                : !variant
                  ? "옵션을 선택해주세요"
                  : !inStock
                    ? "품절"
                    : "장바구니 담기"}
            </Button>
          </div>
        </div>
      </div>

      {/* 옵션 선택 Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent data-testid="mobile-actions-modal">
          <DrawerHeader className="flex items-center justify-between">
            <DrawerTitle>옵션 선택</DrawerTitle>
            <DrawerClose asChild>
              <button className="rounded-full p-1 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-6 pb-8">
            {(product.variants?.length ?? 0) > 1 && (
              <div className="flex flex-col gap-y-6">
                {(product.options || []).map((option) => (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title ?? ""}
                      disabled={optionsDisabled}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileActions
