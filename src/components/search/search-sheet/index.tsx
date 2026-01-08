"use client"

import { Input } from "@components/common/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/common/ui/sheet"
import { ArrowLeft, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { SearchHistory } from "../search-history"
import { SearchHotKeyword } from "../search-hot-keyword"
import { useHistory } from "@hooks/ui/use-history"
import { motion, AnimatePresence } from "framer-motion"
import { PopularKeyword } from "../popular-keyword"

interface SearchSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchSheet({ isOpen, onClose }: SearchSheetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { addKeyword, keywords } = useHistory()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    if (isOpen) {
      window.history.pushState({ view: "search" }, "")
      document.body.style.overflow = "hidden"
    }
    const handlePopState = () => {
      if (isOpen) onClose()
    }
    window.addEventListener("popstate", handlePopState)
    return () => {
      window.removeEventListener("popstate", handlePopState)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      addKeyword(searchTerm.trim())
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full border-none bg-white p-0 sm:max-w-full [&>button]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>아몬드영 검색</SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col">
          {/* 검색 헤더 */}
          <header className="bg-gray-60 sticky top-0 z-10 flex items-center px-2 py-2.5 shadow-sm transition-all">
            <button
              onClick={onClose}
              className="p-3 transition-transform active:scale-95"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>

            <div className="relative mr-4 flex-1">
              <Input
                autoFocus
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="오늘 뭐 살까? 아몬드영"
                className="w-full rounded-xl border-none bg-gray-100 py-4 pr-20 pl-5 text-sm transition-all placeholder:text-gray-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-offset-0"
              />

              <div className="absolute top-1/2 right-3.5 flex -translate-y-1/2 items-center gap-2.5">
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="rounded-full bg-gray-400 p-1 text-white transition-colors active:bg-gray-600"
                    aria-label="입력 내용 지우기"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <Search className="h-4.5 w-4.5 text-gray-800" />
              </div>
            </div>
          </header>

          {/* 최근 검색어 섹션 */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <AnimatePresence initial={false}>
              {isHydrated && keywords.length > 0 && (
                <motion.section
                  key="recent-search-area"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 40 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginBottom: 0,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  className="overflow-hidden"
                >
                  <SearchHistory />
                </motion.section>
              )}
            </AnimatePresence>

            {/* 추천(인기) 검색어 */}
            <section className="mb-6 rounded-2xl">
              <PopularKeyword />
            </section>

            {/* 급상승 검색어 섹션 */}
            <section className="rounded-2xl">
              <SearchHotKeyword />
            </section>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
