import { HeroBannerCarousel2 } from "@/components/banner/banner-carousel2"
import type { BannerGroup } from "@/lib/types/ui/product"

export const MOCK_BANNER_GROUP: BannerGroup = {
  id: "group_001",
  code: "MAIN_HERO",
  title: "메인 히어로 배너",
  category: "MAIN",
  pcWidth: 1920,
  pcHeight: 600,
  mobileWidth: 720,
  mobileHeight: 720,
  description: "홈페이지 최상단 메인 배너 그룹입니다.",
  isActive: true,
  sortOrder: 1,
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  banners: [
    {
      id: "banner_001",
      bannerGroupId: "group_001",
      title: "오늘 2시 시술 시연 라이브",
      description: "서울래쉬 포인트 더블 본딩 기법",
      pcImageFileId: "https://picsum.photos/id/10/1920/600",
      mobileImageFileId: "https://picsum.photos/id/10/720/720",
      linkUrl: "/live/123",
      isActive: true,
      sortOrder: 1,
    } as any,
    {
      id: "banner_002",
      bannerGroupId: "group_001",
      title: "플랫아르디 PLAT ARDI 신상 런칭",
      description: "입술 위에 맑고 투명한 빛을 더하다",
      pcImageFileId: "https://picsum.photos/id/20/1920/600",
      mobileImageFileId: "https://picsum.photos/id/20/720/720",
      linkUrl: "/brand/plat-ardi",
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as any,
    {
      id: "banner_003",
      bannerGroupId: "group_001",
      title: "전문 재료를 한 곳에서, 아몬드영",
      description: "미용인들을 위한 최저가 MRO 쇼핑몰",
      pcImageFileId: "https://picsum.photos/id/30/1920/600",
      mobileImageFileId: "https://picsum.photos/id/30/720/720",
      linkUrl: "/about",
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as any,
    {
      id: "banner_004",
      bannerGroupId: "group_001",
      title: "겨울 시즌 한정 왁싱 재료 특가",
      description: "저자극 왁스부터 진정 젤까지 최대 50%",
      pcImageFileId: "https://picsum.photos/id/40/1920/600",
      mobileImageFileId: "https://picsum.photos/id/40/720/720",
      linkUrl: "/events/winter-sale",
      isActive: true,
      sortOrder: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as any,
    {
      id: "banner_005",
      bannerGroupId: "group_001",
      title: "신규 가입 시 10,000원 쿠폰팩",
      description: "첫 구매 원장님께 드리는 특별한 혜택",
      pcImageFileId: "https://picsum.photos/id/50/1920/600",
      mobileImageFileId: "https://picsum.photos/id/50/720/720",
      linkUrl: "/membership",
      isActive: true,
      sortOrder: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    } as any,
  ],
}

export async function HeroBanner() {
  // const bannerGroup = await getBannerGroupByCode("MAIN_HERO")
  // console.log("bannerGroup", bannerGroup)
  return <HeroBannerCarousel2 bannerGroup={MOCK_BANNER_GROUP} />
}

HeroBanner.Skeleton = function HeroBannerSkeleton() {
  return (
    <div>
      <h1>Hero Banner Skeleton</h1>
    </div>
  )
}
