"use client"

import { Button } from "@components/common/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/common/ui/sheet"
import { getCategoryTree } from "@lib/api/pim/categories"
import { CurrentSubscription } from "@lib/types/ui/membership"
import { CategoryTree } from "@lib/types/ui/pim"
import { UserDetail } from "@lib/types/ui/user"
import { cn } from "@lib/utils"
import { useUser } from "contexts/user-context"
import { ChevronRight, Menu, UserCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState, useTransition } from "react"

export function CategorySheet1({
  currentSubscription,
}: {
  currentSubscription: CurrentSubscription | null
}) {
  const [open, setOpen] = useState(false)
  const [_, startTransition] = useTransition()
  const [categories, setCategories] = useState<CategoryTree[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)

  const { user } = useUser()

  useEffect(() => {
    if (!open) return

    startTransition(async () => {
      const data = await getCategoryTree(1)
      const list: CategoryTree[] = data.categories || []
      setCategories(list)
      if (list.length > 0) setActiveTab(list[0].id)
    })
  }, [])

  const subCategories = useMemo(() => {
    const activeCategory = categories.find((c) => c.id === activeTab)
    return activeCategory?.children || []
  }, [categories, activeTab])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="cursor-pointer">
        <Menu className="h-7 w-7 text-white" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[85%] max-w-[400px] flex-col border-none bg-white p-0 outline-none"
      >
        {/* 상단: 유저 정보 섹션 */}
        <SheetHeader className="p-0 text-left">
          <SheetTitle className="sr-only">카테고리 메뉴</SheetTitle>

          <div className="flex flex-col bg-white px-6 py-10">
            <User user={user} currentSubscription={currentSubscription} />
          </div>

          <div className="h-[8px] w-full bg-[#F2F2F7]" />
        </SheetHeader>

        {/* 메인 영역*/}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측 카테고리 탭 */}
          <aside className="w-[110px] overflow-y-auto bg-[#F9F9F9]">
            {categories
              .filter((c) => c.isActive && c.visibility)
              .map((cat) => (
                <Button
                  key={cat.id}
                  variant="ghost"
                  onClick={() => setActiveTab(cat.id)}
                  className={cn(
                    "relative w-full px-3 py-5 text-center text-[13px] leading-tight transition-all hover:bg-transparent hover:text-gray-400",
                    activeTab === cat.id
                      ? "bg-white font-bold text-black hover:bg-white hover:text-black"
                      : "text-gray-400 hover:bg-gray-200/50"
                  )}
                >
                  {/* 활성화 표시 바 */}
                  {activeTab === cat.id && (
                    <div className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-black" />
                  )}
                  {cat.name}
                </Button>
              ))}
          </aside>

          {/* 우측 서브 카테고리 그리드 */}
          <main className="flex-1 overflow-y-auto bg-white px-5 py-7">
            <div className="mb-8 flex items-end justify-between">
              <h3 className="text-[17px] font-bold tracking-tight">
                {categories.find((c) => c.id === activeTab)?.name}
              </h3>
              <button className="group flex items-center gap-0.5 text-[12px] font-semibold text-gray-400">
                전체보기
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-x-4 gap-y-10">
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#F5F5F7] transition-transform duration-200 group-active:scale-95">
                    {sub.imageUrl ? (
                      <Image
                        src={sub.imageUrl}
                        alt={sub.name}
                        fill
                        className="object-contain p-3.5"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded bg-gray-200/50" />
                    )}
                  </div>
                  <span className="text-center text-[11px] leading-[1.3] font-medium break-keep text-gray-600">
                    {sub.name}
                  </span>
                </button>
              ))}
            </div>
          </main>
        </div>

        <SheetFooter className="flex items-center justify-start! border-gray-100 bg-white px-6 py-4">
          {/* todo: 개인 설정 기능 추가 */}
          {/* <Button
            variant="ghost"
            className="flex cursor-pointer items-center gap-2 text-[12px] font-medium text-gray-400 hover:bg-transparent hover:text-gray-400"
            onClick={() => {
              toast.info("개인 설정 기능은 준비중입니다.")
            }}
          >
            <Settings className="h-4 w-4" />
            설정
          </Button> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
function User({
  user,
  currentSubscription,
}: {
  user: UserDetail | null
  currentSubscription: CurrentSubscription | null
}) {
  const UserAvatar = (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
      <UserCircle2 className="h-8 w-8 text-gray-200" strokeWidth={1.5} />
    </div>
  )

  const MemberShip = currentSubscription ? (
    <Link
      href="/mypage/membership"
      className="text-yellow-30 text-[13px] font-medium hover:underline hover:underline-offset-4"
    >
      멤버십 혜택 적용 중
    </Link>
  ) : (
    // todo: 멤버십 신청 페이지로 이동하게끔..?
    <p className="text-[13px] font-medium text-gray-400">
      혜택 가득한 서비스를 경험해보세요.
    </p>
  )

  if (user) {
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {user.username}님, 반가워요!
          </h2>
          {MemberShip}
        </div>
        {UserAvatar}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/login" className="group flex items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              로그인 해주세요
            </h2>
            <ChevronRight className="h-6 w-6 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-black" />
          </Link>
          {MemberShip}
        </div>
        {UserAvatar}
      </div>

      <div className="flex items-center gap-4 border-t border-gray-50 pt-4">
        <Link
          href="/signup"
          className="text-[13px] font-bold text-gray-900 underline underline-offset-4"
        >
          회원가입
        </Link>
      </div>
    </div>
  )
}
