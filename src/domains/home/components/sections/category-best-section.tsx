"use client"

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import testImg from "@assets/images/test.png"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryTreeNodeDto } from "@lib/api/pim"
import { cn } from "@lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useCategory } from "../../hooks/use-category"
import { ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@hooks/use-media-query"
import { CategorySheet } from "@components/category/category-sheet"
import chunk from "lodash/chunk"
interface CategoryBestSectionProps {
  initialCategories: CategoryTreeNodeDto[]
}

export function CategoryBestSection({
  initialCategories,
}: CategoryBestSectionProps) {
  // const { categories } = useCategory(initialCategories)

  const bestCategories = initialCategories.slice(0, 7)
  const [activeTab, setActiveTab] = useState(initialCategories[0]?.name || "")

  const isMobile = useMediaQuery("(max-width: 768px)")
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDrag, setIsDrag] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const onDragStart = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDrag(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const onDragEnd = () => {
    setIsDrag(false)
  }

  const onDragMove = (e: React.MouseEvent) => {
    if (!isDrag || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 조절
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  // Carousel 상태 업데이트
  useEffect(() => {
    if (!api || !isMobile) return

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    const onReInit = () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }

    onReInit()

    api.on("select", onSelect)
    api.on("reInit", onReInit)

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReInit)
    }
  }, [api, isMobile])

  const products = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  // 데이터를 6개씩 묶는 함수
  const chunkedProducts = chunk(products, 6)

  const mockProductData = {
    brand: "아리메스",
    title: "아리메스 리뉴얼 블랙 영양제 블랙 10ml",
    price: 27000,
    originalPrice: 70000,
    discount: 78,
    rating: 4.9,
    reviewCount: 401,
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between md:justify-center">
        <h2 className="text-[22px] font-bold md:text-[26px]">
          카테고리 <span className="text-yellow-30">베스트</span>
        </h2>

        <CategorySheet
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-40 hover:text-gray-90 hover:bg-transparent md:hidden"
            >
              <span className="underline underline-offset-4">더보기</span>
            </Button>
          }
        />
      </div>

      <div className="mt-4 flex w-full flex-col gap-1.5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            ref={scrollRef}
            onMouseDown={onDragStart}
            onMouseMove={onDragMove}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            className={cn(
              "flex h-auto w-full justify-start gap-2 bg-transparent px-0 py-3.5",
              "scrollbar-hide overflow-x-auto select-none active:cursor-grabbing", // 드래그 중 텍스트 선택 방지
              "md:justify-center md:pt-6 md:pb-[19px]"
            )}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* 카테고리  */}
            {bestCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.name}
                className={cn(
                  "relative cursor-pointer rounded-xl border border-gray-200 px-5 transition-colors",
                  "data-[state=active]:text-gray-10 data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "min-w-fit"
                )}
              >
                <span className="relative z-10">{category.name}</span>

                {/* 활성화 시 움직이는 배경 */}
                {activeTab === category.name && (
                  <motion.div
                    layoutId="active-pill-bg"
                    className="bg-gray-80 absolute inset-0 z-0 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-96"
            >
              <TabsContent value={activeTab} className="mt-6">
                {/* 모바일 */}
                <div className="md:hidden">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                      {chunkedProducts.map((group, index) => (
                        <CarouselItem key={index}>
                          <div className="grid grid-cols-3 gap-x-3 gap-y-8">
                            {group.map((i) => (
                              <ProductCard
                                key={i}
                                rank={i}
                                {...mockProductData}
                              />
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  {/* 페이지네이션 (Dots) */}
                  {count > 1 && (
                    <div className="mt-6 flex justify-center gap-1.5">
                      {Array.from({ length: count }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            current === i ? "w-4 bg-black" : "w-1.5 bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 데스크탑 */}
                <div className="hidden grid-cols-3 gap-x-3 gap-y-8 md:grid md:grid-cols-4 lg:grid-cols-5">
                  {products.slice(0, 10).map((i) => (
                    <ProductCard key={i} rank={i} {...mockProductData} />
                  ))}
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}

function ProductCard({
  rank,
  title,
  price,
  originalPrice,
  discount,
  rating,
  reviewCount,
}: any) {
  return (
    <div className="group flex cursor-pointer flex-col gap-2">
      <Link href={`#`}>
        {/* 이미지 섹셸 */}
        <div className="relative aspect-3/4 overflow-hidden rounded-tl-sm rounded-tr-xl rounded-br-xl rounded-bl-md bg-[#f4f4f4]">
          <Image
            src={testImg}
            width={300}
            height={400}
            alt={title}
            className="pointer-events-none h-full w-full rounded-none object-cover transition-transform duration-300 will-change-transform select-none group-hover:scale-105"
          />
          {/* 순위 배지 */}
          <div className="absolute top-0 left-0 bg-black px-2.5 py-1 text-[12px] font-bold text-white">
            {rank}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "pointer-events-none absolute right-3 bottom-3 translate-y-3 opacity-0 max-sm:hidden",
              "h-9 w-9 rounded-full border border-white/20 bg-white/70 shadow-sm backdrop-blur-md",
              "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
              "transition-all duration-300 ease-out hover:scale-105 hover:bg-white/90 active:scale-95"
            )}
          >
            <ShoppingCart className="h-5 w-5 text-gray-800" strokeWidth={1.5} />
          </Button>
        </div>

        {/* 정보 섹션 */}
        <div className="flex flex-col gap-0.5 px-1">
          <h3 className="line-clamp-2 text-[14px] leading-tight text-gray-600">
            {title}
          </h3>

          {/* 가격 정보 */}
          <div className="mt-1 flex flex-col">
            <div className="text-[13px] text-gray-400">
              <span>55% </span>
              <span className="line-through">
                {originalPrice.toLocaleString()}원
              </span>
            </div>

            <span className="text-[16px] font-bold text-black">
              {price.toLocaleString()}원
            </span>

            <div className="flex items-center gap-1 text-[13px] font-bold text-[#F2994A]">
              <span className="flex items-center gap-0.5">
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-[#F2994A] text-[10px] text-white">
                  ✓
                </span>
                멤버십 할인가
              </span>
            </div>
          </div>

          {/* 별점/리뷰 */}
          <div className="mt-1 flex items-center gap-1">
            <span className="text-[#F2994A]">★</span>
            <span className="text-[12px] font-bold text-gray-900">
              {rating}
            </span>
            <span className="text-[12px] text-gray-400">({reviewCount})</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
