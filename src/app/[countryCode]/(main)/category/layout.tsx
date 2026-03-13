import { SidebarSkeleton } from "@/components/skeletons/category-page"
import { CategorySidebar } from "@/domains/category/components/category-sidebar"
import { getCategoryTree } from "@/lib/api/medusa/categories"
import { Suspense } from "react"

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background">
      <main>
        <div className="container mx-auto max-w-[1360px]">
          <div className="flex px-4 py-6 md:gap-[40px] md:px-[40px]">
            <aside className="hidden w-[233px] shrink-0 md:block">
              <Suspense fallback={<SidebarSkeleton />}>
                <SidebarWrapper />
              </Suspense>
            </aside>
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

async function SidebarWrapper() {
  const categories = await getCategoryTree()

  // pimShowOnMainCategory가 true인 것만 필터링
  const visibleCategories = categories.filter(
    (cat) => cat.metadata?.pimShowOnMainCategory === true
  )

  return <CategorySidebar categories={visibleCategories} />
}
