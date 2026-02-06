"use client"

import { Separator } from "@/components/ui/separator"
import BenefitListItem from "./benefit-list-item"
import { UPCOMING_BENEFITS } from "./benefits-data"

export default function UpcomingBenefitsSection() {
  return (
    <section className="py-12">
      <div className="flex flex-col items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          <span className="text-white">곧 만날 </span>
          <span className="text-[#f29219]">출시 예정 혜택</span>
        </h2>
        <p className="text-white/60 text-sm text-center">
          더 많은 혜택이 준비되어 있습니다
        </p>
      </div>

      <div className="space-y-1">
        {UPCOMING_BENEFITS.map((benefit, index) => (
          <div key={benefit.id}>
            <BenefitListItem benefit={benefit} />
            {index < UPCOMING_BENEFITS.length - 1 && (
              <Separator className="bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
