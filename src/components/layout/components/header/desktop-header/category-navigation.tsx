"use client"

import { CategoryTree } from "@lib/types/ui/pim"
import { cn } from "@lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

/*───────────────────────────
 * 카테고리 네비게이션 컴포넌트
 * 데스크탑 main header에서 사용되는 카테고리 네비게이션 컴포넌트입니다.
 * ex) 홈, 카테고리1, 카테고리2 ... 를 표시합니다.
 *──────────────────────────*/
export function CategoryNavigation({
  mainCategories,
}: {
  mainCategories: CategoryTree[]
}) {
  const { countryCode } = useParams()
  const pathname = usePathname()

  const getIsActive = (slug?: string) => {
    if (!slug) return pathname === `/${countryCode}`
    return pathname?.startsWith(`/${countryCode}/category/${slug}`)
  }

  const allTabs = [
    { name: "홈", slug: undefined },
    ...mainCategories.map((c) => ({ name: c.name, slug: c.slug })),
  ]

  return (
    <ul className="flex items-center gap-7">
      {allTabs.map((tab) => {
        const isActive = getIsActive(tab.slug)

        return (
          <li key={tab.name} className="relative py-2">
            <Link
              href={
                tab.slug
                  ? `/${countryCode}/category/${tab.slug}`
                  : `/${countryCode}`
              }
              className={cn(
                "relative z-10 text-sm font-semibold transition-colors duration-300 md:text-xl",
                isActive ? "text-white" : "text-white/50 hover:text-white"
              )}
            >
              {tab.name}
            </Link>

            {isActive && (
              <motion.div
                layoutId="active-underline"
                className="absolute right-0 bottom-0 left-0 h-[2px] bg-white"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
          </li>
        )
      })}
    </ul>
  )
}
