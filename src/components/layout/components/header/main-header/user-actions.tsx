"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCart, User, Bell, Search } from "lucide-react"
import { useUser } from "contexts/user-context"
import { useState } from "react"
import { SearchSheet } from "@components/search/search-sheet"

export function UserActions() {
  const { countryCode } = useParams()
  const { user } = useUser()

  const [open, setOpen] = useState(true)

  // todo: 임시임
  const cartItemCount = 1
  const hasNotification = true

  return (
    <div className="flex items-center gap-[clamp(0.5px,2vw,1.5rem)]">
      <SearchSheet isOpen={open} onClose={() => setOpen(false)} />
      <button onClick={() => setOpen(true)}>
        <Search className="h-6 w-6 md:h-8 md:w-8" color="white" />
      </button>
      <div className="flex md:hidden">
        {/* 검색 */}
        <UserActionButton
          href={`/${countryCode}/search`}
          icon={<Search className="h-6 w-6 md:h-8 md:w-8" color="white" />}
          label="검색"
        />
      </div>

      {/* 장바구니 */}
      <UserActionButton
        href={`/${countryCode}/cart`}
        icon={<ShoppingCart className="h-6 w-6 md:h-8 md:w-8" color="white" />}
        label="장바구니"
        badgeCount={cartItemCount}
      />

      {/* 로그인 / 마이페이지 */}
      <div className="hidden md:flex">
        <UserActionButton
          href={user ? `/${countryCode}/mypage` : `/${countryCode}/login`}
          icon={<User className="h-6 w-6 md:h-8 md:w-8" color="white" />}
          label={user ? "마이" : "로그인"}
        />
      </div>

      {/* 알림 */}
      <NotificationButton hasDot={hasNotification} label="알림" />
    </div>
  )
}

interface UserActionButtonProps {
  href: string
  icon: React.ReactNode
  label: string
  badgeCount?: number
}

function UserActionButton({
  href,
  icon,
  label,
  badgeCount,
}: UserActionButtonProps) {
  const displayBadge =
    badgeCount && badgeCount > 0 ? (badgeCount > 99 ? "99+" : badgeCount) : null

  return (
    <Link
      href={href}
      className="group flex-col items-center gap-1 text-white md:flex"
    >
      <div className="relative">
        {icon}

        {displayBadge && (
          <span className="bg-yellow-30 absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-white md:h-5 md:w-5">
            {displayBadge}
          </span>
        )}
      </div>
      <span className="hidden text-[clamp(0.625rem,1.2vw,0.75rem)] leading-none font-medium whitespace-nowrap group-hover:underline md:block">
        {label}
      </span>
    </Link>
  )
}

function NotificationButton({
  hasDot,
  label,
}: {
  hasDot: boolean
  label: string
}) {
  return (
    <button className="group relative flex cursor-pointer flex-col items-center gap-1 text-white">
      <div className="relative">
        <Bell className="h-6 w-6 md:h-8 md:w-8" color="white" />
        {hasDot && (
          <span className="bg-yellow-30 absolute -top-1 -right-1 h-2 w-2 rounded-full" />
        )}
      </div>

      <span className="hidden text-[clamp(0.625rem,1.2vw,0.75rem)] leading-none font-medium whitespace-nowrap group-hover:underline md:block">
        {label}
      </span>
    </button>
  )
}
