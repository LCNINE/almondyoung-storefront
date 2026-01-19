"use client"

import { ProductCard } from "@/components/products/prodcut-card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useDraggableScroll } from "@/hooks/ui/use-draggable-scroll"
import { ProductCardProps } from "@/lib/types/ui/product"
import type { CategoryTreeNodeDto } from "@lib/types/dto/pim"
import { AnimatePresence, motion } from "framer-motion"
import { chunk } from "lodash"
import { ProductGrid } from "../../../../../components/products/product-grid"
import { useCategoryBest } from "../../../hooks/use-category-best"
import { SectionHeader } from "../../header/section-header"
import { ProductCarousel } from "../../shared/product-carousel"
import { CategoryTabs } from "./category-tabs"
import { useEffect, useState } from "react"
import { getCategoryBestProducts } from "../../actions/get-category-products"

// todo: 카테고리 탭 변경시 해당 카테고리 데이터 로드

interface CategoryBestSectionProps {
  initialCategories: CategoryTreeNodeDto[]
  initialProducts: ProductCardProps[] | undefined
}

export function CategoryBestSection({
  initialCategories,
  initialProducts,
}: CategoryBestSectionProps) {
  const [products, setProducts] = useState<ProductCardProps[]>(
    initialProducts || []
  )
  const [chunkedProducts, setChunkedProducts] = useState<ProductCardProps[][]>(
    chunk(products, 6) || []
  )

  const bestCategories = initialCategories.slice(0, 7)

  const { activeTab, setActiveTab, visitedTabs, markAsVisited } =
    useCategoryBest(bestCategories[0]?.slug || "")
  const { props: dragHandlers } = useDraggableScroll()

  const isVisitedTab = visitedTabs.has(activeTab)

  // 초기 데이터 설정
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts)
      setChunkedProducts(chunk(initialProducts, 6) || [])
    }
  }, [initialProducts])

  return (
    <div className="w-full">
      <SectionHeader className="justify-between md:justify-center!">
        <SectionHeader.Title>
          카테고리 <span className="text-yellow-30">베스트</span>
        </SectionHeader.Title>
        <SectionHeader.More href={`/category/${activeTab}`} />
      </SectionHeader>

      <div className="flex w-full flex-col gap-1.5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CategoryTabs
            categories={bestCategories}
            activeTab={activeTab}
            dragHandlers={dragHandlers}
            layoutId="category-best-active-pill"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={
                isVisitedTab ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={isVisitedTab ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{
                duration: isVisitedTab ? 0 : 0.2,
              }}
              onAnimationComplete={() => markAsVisited(activeTab)}
              className="min-h-96"
            >
              <TabsContent value={activeTab} className="mt-6">
                {/* modile */}
                <div className="md:hidden">
                  <ProductCarousel className="md:hidden">
                    <ProductCarousel.List>
                      {chunkedProducts.map((group, groupIndex) => (
                        <ProductCarousel.Item key={groupIndex}>
                          <div className="grid grid-cols-3 gap-x-3 gap-y-8 px-1">
                            {group.map((product, itemIndex) => {
                              const rank = groupIndex * 6 + itemIndex + 1
                              return (
                                <ProductCard key={product.id}>
                                  <ProductCard.Thumbnail
                                    src={product.imageSrc}
                                    alt={product.title}
                                    rank={<ProductCard.Rank rank={rank} />}
                                    className="rounded-tl-sm rounded-tr-xl rounded-br-xl rounded-bl-md"
                                  />
                                  <ProductCard.Info {...product} />
                                </ProductCard>
                              )
                            })}
                          </div>
                        </ProductCarousel.Item>
                      ))}
                    </ProductCarousel.List>

                    <ProductCarousel.Indicator itemsPerGroup={1} />
                  </ProductCarousel>
                </div>

                {/* desktop */}
                <div className="hidden md:block">
                  <ProductGrid
                    products={products.slice(0, 10)}
                    showRank={true}
                    roundedClassName="rounded-sm md:rounded-md"
                  />
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}
