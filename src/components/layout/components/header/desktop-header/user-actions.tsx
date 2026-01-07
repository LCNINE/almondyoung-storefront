"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCart, User, Bell } from "lucide-react"
import { useUser } from "contexts/user-context"

export function UserActions() {
  const { countryCode } = useParams()
  const { user } = useUser()

  // todo: 임시임
  const cartItemCount = 1
  const hasNotification = true

  return (
    <div className="flex items-center gap-6">
      {/* 장바구니 */}
      <UserActionButton
        href={`/${countryCode}/cart`}
        icon={<ShoppingCart className="h-8 w-8" color="white" />}
        label="장바구니"
        badgeCount={cartItemCount}
      />

      {/* 로그인 / 마이페이지 */}
      <UserActionButton
        href={user ? `/${countryCode}/mypage` : `/${countryCode}/login`}
        icon={<User className="h-8 w-8" color="white" />}
        label={user ? "마이" : "로그인"}
      />

      {/* 알림 */}
      <NotificationButton hasDot={hasNotification} />
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
      className="group flex flex-col items-center gap-1 text-white"
    >
      <div className="relative">
        {icon}
        {displayBadge && (
          <span className="bg-yellow-30 absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white">
            {displayBadge}
          </span>
        )}
      </div>
      <span className="hidden text-[14px] font-medium group-hover:underline md:block">
        {label}
      </span>
    </Link>
  )
}

function NotificationButton({ hasDot }: { hasDot: boolean }) {
  return (
    <button className="group relative flex cursor-pointer flex-col items-center gap-1 text-white">
      <div className="relative">
        <Bell className="h-8 w-8" color="white" />
        {hasDot && (
          <span className="bg-yellow-30 absolute -top-1 -right-1 h-2 w-2 rounded-full" />
        )}
      </div>
      <span className="hidden text-xs font-medium group-hover:underline md:block md:text-sm">
        알림
      </span>
    </button>
  )
}
