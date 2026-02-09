"use client"

import SurveyHeader from "@/domains/shop-survey/components/surbey-header"
import {
  CATEGORIES,
  TARGET_CUSTOMERS,
  DAYS_OF_WEEK,
  SHOP_TYPES,
} from "@/components/shop-form/constants"
import { shopFormSchema, type ShopFormSchema } from "@/components/shop-form/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { getShopInfo, updateShopInfo } from "@lib/api/users/shop"
import { Building2, Check, Scissors, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"

export function ShopSettingTemplate() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { control, handleSubmit, watch, reset } = useForm<ShopFormSchema>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      isOperating: true,
      yearsOperating: 0,
      shopType: "solo",
      categories: [],
      targetCustomers: [],
      openDays: [],
    },
  })

  const isOperating = watch("isOperating")

  useEffect(() => {
    const loadShopInfo = async () => {
      try {
        setIsLoading(true)
        const shopInfo = await getShopInfo()

        if (!shopInfo) {
          return
        }

        reset({
          isOperating: shopInfo.isOperating,
          yearsOperating: shopInfo.yearsOperating ?? 0,
          shopType: shopInfo.shopType ?? "solo",
          categories: Array.isArray(shopInfo.categories)
            ? shopInfo.categories
            : [],
          targetCustomers: Array.isArray(shopInfo.targetCustomers)
            ? shopInfo.targetCustomers
            : [],
          openDays: Array.isArray(shopInfo.openDays) ? shopInfo.openDays : [],
        })
      } catch (err) {
        console.error("상점 정보 로드 실패:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadShopInfo()
  }, [reset])

  const onSubmit = async (data: ShopFormSchema) => {
    try {
      setIsSubmitting(true)

      const updateDto = {
        isOperating: data.isOperating,
        yearsOperating: data.yearsOperating,
        shopType: data.shopType,
        categories: data.categories,
        targetCustomers: data.targetCustomers,
        openDays: data.openDays,
      }

      await updateShopInfo(updateDto)
      alert("상점 정보가 성공적으로 저장되었습니다.")
    } catch (err) {
      console.error("상점 정보 저장 실패:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 md:px-6">
      <SurveyHeader />

      <div className="flex flex-col gap-10 bg-white p-[15px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          {/* 샵 운영 여부 */}
          <section className="flex w-full flex-col gap-5">
            <header>
              <h2 className="text-base font-bold text-black">
                샵 운영 여부 <span className="text-red-500">*</span>
              </h2>
            </header>

            <Controller
              name="isOperating"
              control={control}
              render={({ field: { value, onChange } }) => (
                <fieldset className="flex gap-2">
                  <legend className="sr-only">운영 상태 선택</legend>
                  <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`flex items-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                      value
                        ? "bg-amber-500 font-bold text-white"
                        : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                    }`}
                  >
                    {value && <Check className="h-3.5 w-3.5" />}샵 운영 중
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`flex items-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                      !value
                        ? "bg-amber-500 font-bold text-white"
                        : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                    }`}
                  >
                    {!value && <Check className="h-3.5 w-3.5" />}
                    예비 원장
                  </button>
                </fieldset>
              )}
            />

            {isOperating && (
              <>
                <p className="text-xs text-black">얼마나 운영하셨나요?</p>

                <Controller
                  name="yearsOperating"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <div className="flex items-center justify-start gap-5">
                      <div
                        className="flex items-start justify-start"
                        role="group"
                      >
                        <button
                          type="button"
                          onClick={() => onChange(Math.max(0, value - 1))}
                          className="relative h-7 w-7 rounded border border-zinc-300"
                        >
                          -
                        </button>

                        <div className="relative mx-2 flex h-7 min-w-[36px] items-center justify-center rounded border border-zinc-300 px-2">
                          <span className="text-xs font-bold text-black">
                            {value}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onChange(value + 1)}
                          className="relative h-7 w-7 rounded border border-zinc-300"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs font-normal text-black">
                        년차
                      </span>
                    </div>
                  )}
                />
              </>
            )}
          </section>

          {/* 샵 기본 정보 (규모) */}
          <section className="flex w-full flex-col gap-5 md:w-[770px]">
            <header>
              <h2 className="flex items-center gap-1 text-base font-bold text-black">
                <Building2 className="h-4 w-4 text-amber-500" />샵 기본 정보
                <span className="text-red-500">*</span>
              </h2>
            </header>

            <p className="text-xs text-black">매장 규모</p>

            <Controller
              name="shopType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <fieldset className="flex flex-wrap gap-2">
                  {SHOP_TYPES.map(({ value: typeValue, label }) => (
                    <button
                      key={typeValue}
                      type="button"
                      onClick={() => onChange(typeValue)}
                      className={`flex items-center justify-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                        value === typeValue
                          ? "bg-amber-500 font-bold text-white"
                          : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </fieldset>
              )}
            />
          </section>

          {/* 시술 종류 (다중 선택) */}
          <section className="flex w-full flex-col gap-5 md:w-[770px]">
            <header>
              <h2 className="flex items-center gap-1 text-base font-bold text-black">
                <Scissors className="h-4 w-4 text-amber-500" />샵 유형 및 시술
                종류
              </h2>
            </header>

            <p className="text-xs text-black">
              어떤 시술을 제공(또는 준비)하고 계신가요? (다중 선택 가능)
              <span className="ml-1 text-red-500">*</span>
            </p>

            <Controller
              name="categories"
              control={control}
              render={({ field: { value, onChange } }) => (
                <fieldset className="flex flex-wrap gap-2">
                  {CATEGORIES.map((item) => {
                    const isSelected = value.includes(item)
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const newValue = isSelected
                            ? value.filter((v) => v !== item)
                            : [...value, item]
                          onChange(newValue)
                        }}
                        className={`flex items-center justify-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                          isSelected
                            ? "bg-amber-500 font-bold text-white"
                            : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}
                </fieldset>
              )}
            />
          </section>

          {/* 고객층 & 운영 요일 */}
          <section className="flex w-full flex-col gap-5">
            <header>
              <h2 className="flex items-center gap-1 text-base font-bold text-black">
                <Users className="h-4 w-4 text-amber-500" />
                고객층 & 운영 정보
              </h2>
            </header>

            <p className="text-xs text-black">
              주요 고객층은 누구인가요? (다중 선택)
            </p>
            <Controller
              name="targetCustomers"
              control={control}
              render={({ field: { value, onChange } }) => (
                <fieldset className="flex flex-wrap gap-2">
                  {TARGET_CUSTOMERS.map((target) => {
                    const isSelected = value.includes(target)
                    return (
                      <button
                        key={target}
                        type="button"
                        onClick={() => {
                          const newValue = isSelected
                            ? value.filter((v) => v !== target)
                            : [...value, target]
                          onChange(newValue)
                        }}
                        className={`flex items-center justify-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                          isSelected
                            ? "bg-amber-500 font-bold text-white"
                            : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                        }`}
                      >
                        {target}
                      </button>
                    )
                  })}
                </fieldset>
              )}
            />

            <p className="text-xs text-black">샵 운영 요일 (다중 선택)</p>
            <Controller
              name="openDays"
              control={control}
              render={({ field: { value, onChange } }) => (
                <fieldset className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = value.includes(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const newValue = isSelected
                            ? value.filter((v) => v !== day)
                            : [...value, day]
                          onChange(newValue)
                        }}
                        className={`flex items-center justify-center gap-2.5 rounded-[10px] px-4 py-3.5 text-xs shadow-[0_4px_4px_rgba(0,0,0,0.1)] transition-colors ${
                          isSelected
                            ? "bg-amber-500 font-bold text-white"
                            : "bg-white font-normal text-gray-600 outline-[0.5px] outline-zinc-300"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </fieldset>
              )}
            />
          </section>

          <footer className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[4px] bg-[#FFA500] px-6 py-3 text-white transition-colors hover:bg-[#FF8C00] disabled:bg-gray-300"
            >
              {isSubmitting ? "저장 중..." : "저장하기"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
