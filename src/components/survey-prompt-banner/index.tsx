"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { updateSurveyRemind } from "@/lib/api/users/shop-suvery"

const STORAGE_KEY = "survey-banner-dismissed"

interface SurveyPromptBannerProps {
  countryCode: string
  className?: string
}

export function SurveyPromptBanner({
  countryCode,
  className,
}: SurveyPromptBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 세션 스토리지 체크 후 표시 여부 결정
  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  // 닫기 버튼: 현재 세션에서만 숨김
  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true")
    setIsVisible(false)
  }

  // 나중에 할게요: 서버 API 호출 → 며칠 후 다시 표시
  const handleRemindLater = async () => {
    setIsLoading(true)
    const result = await updateSurveyRemind()
    setIsLoading(false)

    if (result.success) {
      setIsVisible(false)
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={cn(
          "fixed right-0 left-0 z-999",
          // 모바일: 하단 네비게이션(h-16) 위로
          "pb-safe bottom-20 px-3",
          // 데스크탑: 하단에 붙임
          "md:bottom-0 md:px-6 md:pb-6",
          className
        )}
      >
        {/* 모바일 레이아웃 */}
        <div
          className={cn(
            "mx-auto max-w-lg md:hidden",
            "rounded-xl bg-white/95 backdrop-blur-lg",
            "border border-gray-200/50",
            "shadow-[0_4px_20px_rgba(0,0,0,0.1)]",
            "px-4 py-3"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-9 w-9 shrink-0 rounded-full",
                "bg-linear-to-br from-amber-400 to-orange-500",
                "flex items-center justify-center"
              )}
            >
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[12.2px] font-medium text-gray-900">
                맞춤 상품을 추천받아보세요
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                disabled={isLoading}
                className="h-auto px-3 py-1.5 text-[12px] text-gray-500"
              >
                닫기
              </Button>
              <Button
                asChild
                size="sm"
                className="h-auto rounded-full px-3.5 py-1.5 text-[12px]"
              >
                <Link href={`/${countryCode}/shop-survey`}>설정하기</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* 데스크탑 레이아웃 */}
        <div
          className={cn(
            "relative mx-auto hidden max-w-lg md:block",
            "rounded-2xl bg-white/80 backdrop-blur-xl",
            "border border-gray-200/50",
            "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
            "p-5"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute top-3 right-3 h-8 w-8 rounded-full text-gray-400 hover:text-gray-600"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-4">
            <div
              className={cn(
                "h-10 w-10 shrink-0 rounded-full",
                "bg-linear-to-br from-amber-400 to-orange-500",
                "flex items-center justify-center",
                "shadow-lg shadow-orange-500/25"
              )}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0 flex-1 pr-4">
              <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                원장님께 딱 맞는 상품을 찾아드릴게요
              </h3>
              <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
                1분이면 끝나는 간단한 설문으로 맞춤 상품을 추천받아보세요
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Button asChild size="sm" className="rounded-full">
                  <Link href={`/${countryCode}/shop-survey`}>맞춤 설정하기</Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemindLater}
                  disabled={isLoading}
                  className="rounded-full text-gray-500"
                >
                  {isLoading ? "처리 중..." : "나중에 할게요"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
