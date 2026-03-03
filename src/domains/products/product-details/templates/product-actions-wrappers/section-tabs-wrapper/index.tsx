import { getRatingSummary } from "@/lib/api/ugc/reviews"
import { RatingSummaryResponseDto } from "@/lib/types/dto/ugc"
import { SectionTabs } from "../../../components2/section-nav"

interface Props {
  productId: string
  children: React.ReactNode
}

export async function SectionTabsWrapper({ productId, children }: Props) {
  const ratingSummary: RatingSummaryResponseDto | null = await getRatingSummary(
    productId
  ).catch(() => null)

  return (
    <SectionTabs reviewCount={ratingSummary?.totalCount ?? 0}>
      {children}
    </SectionTabs>
  )
}
