"use client"

import { Tabs, TabsContent } from "@/components/ui/tabs"
import { HttpTypes } from "@medusajs/types"
import { ReactNode } from "react"
import { Header, MoreButton, Title } from "../../header"
import { ResponsiveTabList } from "../responsive-tab-list"
import ProductCard from "@/domains/category/components/products/product-card"
import { StoreCustomerWithGroups } from "@/lib/types/ui/medusa"
import { CustomerGroup } from "@/lib/types/dto/medusa"
import { ProductSectionSkeleton } from "./skeleton"
import { ProductSectionEmpty } from "./empty-state"

interface TabItem {
  id: string
  name: string
  handle?: string
}

interface ProductSectionProps<T extends TabItem> {
  title: ReactNode
  tabs?: readonly T[]
  activeTab?: T
  products: HttpTypes.StoreProduct[]
  isPending?: boolean
  moreHref?: string
  onTabChange?: (tab: T) => void
  customer: StoreCustomerWithGroups | null
  emptyTitle?: string
  emptyDescription?: string
}

export function ProductSection<T extends TabItem>({
  title,
  tabs,
  activeTab,
  products,
  isPending = false,
  moreHref,
  onTabChange,
  customer,
  emptyTitle,
  emptyDescription,
}: ProductSectionProps<T>) {
  const hasTabs = tabs && tabs.length > 0 && activeTab

  const handleTabChange = (value: string) => {
    if (!tabs || !onTabChange) return
    const nextTab = tabs.find((t) => t.id === value)
    if (nextTab) {
      onTabChange(nextTab)
    }
  }

  const renderProducts = () => {
    if (isPending) {
      return <ProductSectionSkeleton />
    }

    if (products.length === 0) {
      return (
        <ProductSectionEmpty title={emptyTitle} description={emptyDescription} />
      )
    }

    return (
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {products.map((p, index) => (
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
        ))}
      </ul>
    )
  }

  return (
    <div className="w-full">
      <Header className="mb-6">
        <Title className="md:flex-1 md:text-center">{title}</Title>
        {moreHref && <MoreButton href={moreHref} />}
      </Header>

      {hasTabs ? (
        <Tabs defaultValue={activeTab.id} onValueChange={handleTabChange}>
          <ResponsiveTabList
            items={tabs}
            activeId={activeTab.id}
            onTabChange={handleTabChange}
          />
          <TabsContent value={activeTab.id}>{renderProducts()}</TabsContent>
        </Tabs>
      ) : (
        renderProducts()
      )}
    </div>
  )
}
