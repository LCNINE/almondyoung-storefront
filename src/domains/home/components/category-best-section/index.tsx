"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { FIXED_CATEGORIES, FixedCategory } from "@/lib/constants/categories"
import { HttpTypes } from "@medusajs/types"
import { useState, useTransition } from "react"
import { Header, MoreButton, Title } from "../header"
import { ResponsiveTabList } from "../shared/responsive-tab-list"
import ProductCard from "@/domains/category/components/products/product-card"
import { StoreCustomerWithGroups } from "@/lib/types/ui/medusa"
import { CustomerGroup } from "@/lib/types/dto/medusa"
import { listProducts } from "@/lib/api/medusa/products"
import { CategoryBestSkeleton } from "./skeleton"

interface CategoryBestSectionProps {
  initialProducts: HttpTypes.StoreProduct[] | undefined
  regionId?: string
  customer: StoreCustomerWithGroups | null
}

export function CategoryBestSection({
  initialProducts,
  regionId,
  customer,
}: CategoryBestSectionProps) {
  const categories = FIXED_CATEGORIES

  const [activeTab, setActiveTab] = useState<FixedCategory>(categories[0])
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>(
    initialProducts || []
  )
  const [isPending, startTransition] = useTransition()

  const handleTabChange = (value: string) => {
    const nextTab = categories.find((c) => c.id === value) as FixedCategory
    setActiveTab(nextTab)

    startTransition(async () => {
      const nextProducts = await listProducts({
        queryParams: { category_id: nextTab.id, limit: 10 },
        regionId,
      })
      setProducts(nextProducts.response.products)
    })
  }

  return (
    <div className="w-full">
      <Header className="mb-6">
        <Title className="md:flex-1 md:text-center">
          카테고리 <span className="text-yellow-30">베스트</span>
        </Title>

        <MoreButton href={`/category/${activeTab.handle}`} />
      </Header>

      <Tabs
        defaultValue={categories[0]?.id || ""}
        onValueChange={handleTabChange}
      >
        <ResponsiveTabList
          items={categories}
          activeId={activeTab.id}
          onTabChange={handleTabChange}
        />

        <TabsContent value={activeTab.id}>
          {isPending ? (
            <CategoryBestSkeleton />
          ) : (
            <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((p, index) => {
                return (
                  <li key={p.id}>
                    <ProductCard
                      product={p}
                      isMembership={
                        customer?.groups?.some(
                          (group: CustomerGroup) =>
                            group.id === process.env.MEDUSA_MEMBERSHIP_GROUP_ID
                        ) ?? false
                      }
                      isMembershipOnly={
                        p.metadata?.isMembershipOnly === true ||
                        p.metadata?.isMembershipOnly === "true"
                      }
                      rank={index + 1}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
