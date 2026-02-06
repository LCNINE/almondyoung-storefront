"use client"

import type { BenefitItem } from "./benefit.types"

interface BenefitListItemProps {
  benefit: BenefitItem
  onClick?: () => void
}

export default function BenefitListItem({
  benefit,
  onClick,
}: BenefitListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors"
    >
      <div className="flex items-start gap-4">
        <span className="min-w-[24px] shrink-0 text-sm font-medium text-[#f29219]">
          {benefit.number}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-sm font-medium text-white">
            {benefit.title}
          </span>
          <span className="text-xs text-white/60 break-words">
            {benefit.description}
          </span>
        </div>
      </div>
    </button>
  )
}
