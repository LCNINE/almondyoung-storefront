import MypageLayout from "@/app/[countryCode]/(mypage)/_components/mypage-layout"
import { MypageReviewsSkeleton } from "@/components/skeletons/page-skeletons"
import { siteConfig } from "@/lib/config/site"
import { getSEOTags } from "@/lib/seo"
import { WithHeaderLayout } from "@components/layout"
import { ReviewsTemplate } from "domains/reviews/manage/template/reviews-template"
import { Suspense } from "react"

export const metadata = getSEOTags({
  title: `${siteConfig.appName} | 리뷰`,
  openGraph: {},
  extraTags: {},
})

export default function MyReviewsPage() {
  return (
    <WithHeaderLayout
      config={{
        showDesktopHeader: true,
        showMobileHeader: false,
        showMobileSubBackHeader: true,
        mobileSubBackHeaderTitle: "리뷰 목록",
      }}
    >
      <MypageLayout>
        <Suspense fallback={<MypageReviewsSkeleton />}>
          <ReviewsTemplate />
        </Suspense>
      </MypageLayout>
    </WithHeaderLayout>
  )
}
