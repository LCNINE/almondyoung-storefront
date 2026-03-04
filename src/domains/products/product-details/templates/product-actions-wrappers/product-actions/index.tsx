"use client"

import { addToCart } from "@/lib/api/medusa/cart"
import { useIntersection } from "@/hooks/use-intersection"
import { Button } from "@/components/ui/button"
import { getPricesForVariant } from "@/lib/utils/get-product-price"
import { VariantPrice } from "@/lib/types/common/price"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { Minus, Plus, X } from "lucide-react"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"
import { Separator } from "@/components/ui/separator"
import MobileActions from "./mobile-actions"
import OptionSelect from "./option-select"
import ProductDetailPrice from "./product-detail-price"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

type SelectedItem = {
  variantId: string
  quantity: number
  variant: HttpTypes.StoreProductVariant
  price: VariantPrice
  label: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const getVariantLabel = (variant: HttpTypes.StoreProductVariant) => {
  return (
    variant.options?.map((o: any) => o.value).join(" / ") ||
    variant.title ||
    "기본 옵션값"
  )
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

  const isSimple = (product.variants?.length ?? 0) <= 1

  // 변형이 1개뿐이면 자동으로 선택 리스트에 추가
  useEffect(() => {
    if (isSimple && product.variants?.length === 1) {
      const variant = product.variants[0]
      const price = getPricesForVariant(variant)
      if (price) {
        setSelectedItems([
          {
            variantId: variant.id,
            quantity: 1,
            variant,
            price,
            label: getVariantLabel(variant),
          },
        ])
      }
    }
  }, [product.variants, isSimple])

  // 옵션으로 매칭되는 variant 찾기
  const matchedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // 옵션 선택 시: 매칭된 variant를 선택 리스트에 추가
  useEffect(() => {
    if (!matchedVariant || isSimple) return

    const alreadySelected = selectedItems.some(
      (item) => item.variantId === matchedVariant.id
    )
    if (alreadySelected) return

    const price = getPricesForVariant(matchedVariant)
    if (!price) return

    setSelectedItems((prev) => [
      ...prev,
      {
        variantId: matchedVariant.id,
        quantity: 1,
        variant: matchedVariant,
        price,
        label: getVariantLabel(matchedVariant),
      },
    ])
  }, [matchedVariant, isSimple, selectedItems])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // 수량 변경
  const updateQuantity = useCallback((variantId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }, [])

  // 항목 삭제
  const removeItem = useCallback((variantId: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.variantId !== variantId)
    )
  }, [])

  // 총 수량 & 총 가격
  const totalQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price.calculated_price_number * item.quantity,
    0
  )

  // URL에 첫 번째 선택 variant ID 동기화
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = selectedItems.length > 0 ? selectedItems[0].variantId : null

    if (params.get("v_id") === value) return

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    window.history.replaceState(null, "", pathname + "?" + params.toString())
  }, [selectedItems, pathname, searchParams])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const displayVariant =
    selectedItems.length > 0 ? selectedItems[0].variant : undefined

  // 재고 확인
  const allInStock = selectedItems.every((item) => {
    const v = item.variant
    if (!v.manage_inventory) return true
    if (v.allow_backorder) return true
    return (v.inventory_quantity || 0) > 0
  })

  // 장바구니 담기
  const handleAddToCart = () => {
    if (selectedItems.length === 0) return

    startTransition(async () => {
      try {
        for (const item of selectedItems) {
          await addToCart({
            variantId: item.variantId,
            quantity: item.quantity,
            countryCode,
          })
        }
      } catch (error: unknown) {
        const err = error as Error & { digest?: string }
        if (err.digest === "UNAUTHORIZED" || err.message === "UNAUTHORIZED") {
          throw error
        }
      }
    })
  }

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <ProductDetailPrice product={product} selectedVariant={displayVariant} />

      <Separator />

      {/* 옵션 선택 - variant가 2개 이상일 때만 표시 */}
      {!isSimple && (
        <div className="flex flex-col gap-y-4 py-2">
          {(product.options || []).map((option) => (
            <div key={option.id}>
              <OptionSelect
                option={option}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title ?? ""}
                data-testid="product-options"
                disabled={!!disabled || isPending}
              />
            </div>
          ))}
        </div>
      )}

      {/* 선택된 항목 리스트 */}
      {selectedItems.length > 0 && (
        <>
          {!isSimple && <Separator />}
          <div className="flex flex-col gap-3 py-2">
            {selectedItems.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between gap-4 rounded-lg px-4 py-3"
              >
                <div className="flex flex-col gap-2">
                  {!isSimple && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.variantId, -1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 rounded-r-none"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <div className="flex h-8 w-10 items-center justify-center border-y text-sm">
                      {item.quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.variantId, 1)}
                      className="h-8 w-8 rounded-l-none"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-base font-bold">
                    {(
                      item.price.calculated_price_number * item.quantity
                    ).toLocaleString()}
                    원
                  </span>
                  {!isSimple && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.variantId)}
                      className="h-6 w-6 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 구매수량 / 총 가격 */}
      {selectedItems.length > 0 && (
        <>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold">
              구매수량 {totalQuantity}개
            </span>
            <span className="text-xl font-bold">
              총 {totalPrice.toLocaleString()}원
            </span>
          </div>
        </>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={
          selectedItems.length === 0 || !allInStock || !!disabled || isPending
        }
        className="h-12 w-full text-base"
        data-testid="add-product-button"
      >
        {(() => {
          if (isPending) return "담는 중..."
          if (selectedItems.length === 0) return "옵션을 선택해주세요"
          if (!allInStock) return "품절"
          return "장바구니 담기"
        })()}
      </Button>

      <MobileActions
        product={product}
        variant={displayVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={allInStock}
        handleAddToCart={handleAddToCart}
        isPending={isPending}
        show={!inView}
        optionsDisabled={!!disabled || isPending}
      />
    </div>
  )
}
