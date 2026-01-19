"use client"

import { Button } from "@/components/ui/button"
import { HttpTypes, StoreCartAddress } from "@medusajs/types"
import { MapPin } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { ShippingAddressModal } from "./shipping-address-modal"
import { ShippingAddressSelector } from "./shipping-address-selector"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface ShippingSectionProps {
  shippingAddress: StoreCartAddress | null
  addressName?: string | null
}

interface EditAddressState {
  address: HttpTypes.StoreCustomerAddress
  defaultValues: {
    addressName?: string
    name: string
    phone: string
    postalCode: string
    address1: string
    address2: string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

const isValidAddress = (address: StoreCartAddress | null): boolean => {
  if (!address) return false

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

const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 3) return numbers
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
}

const formatAddress = (
  address: StoreCartAddress | null
): {
  name: string
  phone: string
  fullAddress: string
} => {
  if (!address) {
    return { name: "", phone: "", fullAddress: "" }
  }

  const name = [address.first_name, address.last_name].filter(Boolean).join(" ")
  const phone = address.phone ? formatPhoneNumber(address.phone) : ""
  const addressParts = [
    address.province,
    address.city,
    address.address_1,
    address.address_2,
  ].filter(Boolean)
  const fullAddress = addressParts.join(" ")

  return { name, phone, fullAddress }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export const ShippingSection = ({
  shippingAddress,
  addressName,
}: ShippingSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"create" | "edit">("create")
  const [editAddressState, setEditAddressState] =
    useState<EditAddressState | null>(null)

  const isValid = useMemo(
    () => isValidAddress(shippingAddress),
    [shippingAddress]
  )

  const { name, phone, fullAddress } = useMemo(
    () => formatAddress(shippingAddress),
    [shippingAddress]
  )

  // 새 배송지 추가 핸들러
  const handleAddNewAddress = useCallback(() => {
    setModalMode("create")
    setEditAddressState(null)
    setIsModalOpen(true)
  }, [])

  // 배송지 수정 핸들러
  const handleEditAddress = useCallback(
    (address: HttpTypes.StoreCustomerAddress) => {
      setModalMode("edit")
      setEditAddressState({
        address,
        defaultValues: {
          addressName: address.address_name ?? "",
          name: [address.first_name, address.last_name]
            .filter(Boolean)
            .join(" "),
          phone: address.phone ?? "",
          postalCode: address.postal_code ?? "",
          address1: [address.province, address.city, address.address_1]
            .filter(Boolean)
            .join(" "),
          address2: address.address_2 ?? "",
        },
      })
      setIsModalOpen(true)
    },
    []
  )

  // 모달 닫기 핸들러
  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      // 모달이 닫힐 때 상태 초기화
      setEditAddressState(null)
      setModalMode("create")
    }
  }, [])

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
                {(addressName || name) && (
                  <p className="mb-3 flex flex-col gap-2 text-[15px] font-semibold text-gray-900 md:flex-row md:items-center md:text-lg">
                    {addressName ? (
                      <>
                        <span className="font-bold">{addressName}</span>
                        {name ? (
                          <span className="text-sm font-normal text-gray-600">
                            {name}
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <span>{name}</span>
                    )}
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
                onClick={() => setIsSelectorOpen(true)}
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
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSelectorOpen(true)}
              >
                저장된 배송지
              </Button>
              <Button type="button" onClick={handleAddNewAddress}>
                새 배송지 추가
              </Button>
            </div>
          </div>
        )}
      </div>

      <ShippingAddressSelector
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onAddNewAddress={handleAddNewAddress}
        onEditAddress={handleEditAddress}
      />

      <ShippingAddressModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        mode={modalMode}
        addressId={editAddressState?.address.id}
        defaultValues={editAddressState?.defaultValues}
      />
    </section>
  )
}
