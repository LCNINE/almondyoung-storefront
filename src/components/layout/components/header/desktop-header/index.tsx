import { CategorySheet } from "@components/category/category-sheet"
import { getCurrentSubscription } from "@lib/api/membership"
import { getCategoryTree } from "@lib/api/pim"
import { SearchInput } from "../search-input"
import { CategoryNavigation } from "./category-navigation"
import { Logo } from "./logo"
import { UserActions } from "./user-actions"

export async function DesktopHeader() {
  const categories = await getCategoryTree().catch(() => null)
  const mainCategories = categories?.categories.slice(0, 7) ?? []

  const currentSubscription = await getCurrentSubscription().catch(() => null)

  return (
    <header className="bg-header-background hidden overflow-visible md:block">
      <div className="container mx-auto max-w-[1360px] px-[40px]">
        {/* 상단 */}
        <div className="flex items-center justify-between py-5">
          <Logo />

          <div className="ml-8 flex max-w-3xl flex-1 items-center gap-8 overflow-visible lg:ml-12">
            <SearchInput />

            <UserActions />
          </div>
        </div>

        {/* 하단  */}
        <nav aria-label="메인 카테고리" className="flex items-center gap-7">
          <CategorySheet currentSubscription={currentSubscription} />

          <CategoryNavigation mainCategories={mainCategories} />
        </nav>
      </div>
    </header>
  )
}
