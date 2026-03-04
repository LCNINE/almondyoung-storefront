"use client"

import { addToCart } from "@/lib/api/medusa/cart"
import { useIntersection } from "@/hooks/use-intersection"
import { Button } from "@/components/ui/button"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { Separator } from "@/components/ui/separator"
import MobileActions from "./mobile-actions"
import OptionSelect from "./option-select"
import ProductDetailPrice from "./product-detail-price"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce(
    (acc: Record<string, string>, varopt: any) => {
      acc[varopt.option_id] = varopt.value
      return acc
    },
    {}
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

  // 변형이 1개뿐이면 자동으로 옵션 세팅
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variant = product.variants[0]
      const optMap = optionsAsKeymap(variant.options)
      if (optMap) {
        setOptions(optMap)
      }
    }
  }, [product.variants])

  // 옵션으로 매칭되는 variant 찾기
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // 유효한 variant인지 확인
  const isValidVariant = useMemo(() => {
    return !!selectedVariant
  }, [selectedVariant])

  // 재고 확인
  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory) return true
    if (selectedVariant.allow_backorder) return true
    return (selectedVariant.inventory_quantity || 0) > 0
  }, [selectedVariant])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // URL에 variant ID 동기화
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = selectedVariant?.id ?? null

    if (params.get("v_id") === value) return

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    window.history.replaceState(null, "", pathname + "?" + params.toString())
  }, [selectedVariant, pathname, searchParams])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  // 장바구니 담기
  const handleAddToCart = () => {
    if (!selectedVariant || !isValidVariant) return

    startTransition(async () => {
      try {
        await addToCart({
          variantId: selectedVariant.id,
          quantity: 1,
          countryCode,
        })
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
      <ProductDetailPrice
        product={product}
        selectedVariant={selectedVariant}
      />

      <Separator />

      {/* 옵션 선택 - variant가 2개 이상일 때만 표시 */}
      {(product.variants?.length ?? 0) > 1 && (
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

      <Button
        onClick={handleAddToCart}
        disabled={!isValidVariant || !inStock || !!disabled || isPending}
        className="h-12 w-full text-base"
        data-testid="add-product-button"
      >
        {isPending
          ? "담는 중..."
          : !isValidVariant
            ? "옵션을 선택해주세요"
            : !inStock
              ? "품절"
              : "장바구니 담기"}
      </Button>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={setOptionValue}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isPending={isPending}
        show={!inView}
        optionsDisabled={!!disabled || isPending}
      />
    </div>
  )
}
