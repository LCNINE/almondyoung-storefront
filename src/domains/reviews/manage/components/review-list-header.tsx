import { CircleHelp } from "lucide-react"

interface ReviewListHeaderProps {
  title: string
  count: number
  children?: React.ReactNode
}

/**
 * 리뷰 목록 헤더 컴포넌트
 * 제목, 개수, 필터를 표시
 */
export const ReviewListHeader = ({
  title,
  count,
  children,
}: ReviewListHeaderProps) => {
  return (
    <header className="mb-4 flex items-center justify-between">
      {/* 제목 그룹 */}
      <div className="flex items-center gap-1">
        <h3 className="text-[15px] font-medium text-[#333333]">
          {title} {count}
        </h3>
        <CircleHelp className="h-4 w-4 text-[#999999]" />
      </div>

      {children}
    </header>
  )
}
