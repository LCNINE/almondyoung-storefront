import { Button } from "@/components/ui/button"
import { StoreCartAddress } from "@medusajs/types"
import { MapPin } from "lucide-react"
import { useMemo } from "react"

interface ShippingSectionProps {
  shippingAddress: StoreCartAddress | null
}

const isValidAddress = (address: StoreCartAddress | null): boolean => {
  if (!address) return false

  // id만 있고 실제 주소 정보가 없는 경우 체크
  const hasName = !!(address.first_name || address.last_name)
  const hasAddress = !!(
    address.province ||
    address.city ||
    address.address_1 ||
    address.address_2
  )
  const hasPhone = !!address.phone

  return hasName || hasAddress || hasPhone
}

// 주소 정보 포맷팅
const formatAddress = (address: StoreCartAddress | null): {
  name: string
  phone: string
  fullAddress: string
} => {
  if (!address) {
    return { name: "", phone: "", fullAddress: "" }
  }

  const name = [address.first_name, address.last_name]
    .filter(Boolean)
    .join(" ")

  const phone = address.phone || ""

  const addressParts = [
    address.province,
    address.city,
    address.address_1,
    address.address_2,
  ].filter(Boolean)

  const fullAddress = addressParts.join(" ")

  return { name, phone, fullAddress }
}

export const ShippingSection = ({ shippingAddress }: ShippingSectionProps) => {
  const isValid = useMemo(
    () => isValidAddress(shippingAddress),
    [shippingAddress]
  )

  const { name, phone, fullAddress } = useMemo(
    () => formatAddress(shippingAddress),
    [shippingAddress]
  )

  return (
    <section aria-labelledby="shipping-heading" className="mb-8">
      <h2
        id="shipping-heading"
        className="mb-3 text-base font-bold text-gray-900 md:text-xl"
      >
        배송지
      </h2>
      <div className="rounded-md border border-gray-200 bg-white px-[14px] py-[18px] md:rounded-[10px] md:px-10 md:py-8">
        {isValid ? (
          <>
            <div className="flex justify-between md:w-full">
              <div className="flex-1">
                {name && (
                  <p className="mb-3 flex flex-col gap-2 text-[15px] font-semibold text-gray-900 md:flex-row md:items-center md:text-lg">
                    <span>{name}</span>
                    <span className="hidden rounded bg-[#e8f6ea] px-2 py-[2px] text-[11px] font-semibold text-[#2ba24c] md:inline">
                      기본 배송지
                    </span>
                  </p>
                )}
                {phone && (
                  <p className="mt-1 text-[13px] text-gray-700 md:text-base">
                    {phone}
                  </p>
                )}
                {fullAddress && (
                  <address className="text-[13px] leading-5 text-gray-700 not-italic md:text-base">
                    {fullAddress}
                  </address>
                )}
              </div>
              <button
                type="button"
                className="h-fit rounded border border-gray-300 px-3 py-1 text-[12px] font-medium text-gray-700 transition-colors hover:bg-gray-50 md:rounded-[3px] md:px-2.5 md:py-[5px] md:text-[13px]"
              >
                변경
              </button>
            </div>
            <div className="mt-3">
              <label htmlFor="shipping-memo" className="sr-only">
                배송메모
              </label>
              <select
                id="shipping-memo"
                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-[13px] text-gray-700 md:rounded-[5px] md:px-4 md:py-3.5 md:text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  배송메모를 선택해주세요
                </option>
              </select>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <div className="bg-gray-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full md:h-16 md:w-16">
              <MapPin className="text-gray-40 h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="text-gray-90 mb-2 text-base font-semibold md:text-lg">
              배송지 정보가 없습니다
            </h3>
            <p className="text-gray-60 mb-4 text-center text-sm md:text-base">
              배송지를 등록해주세요.
            </p>
            <Button
              type="button"
            >
              배송지 등록
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
