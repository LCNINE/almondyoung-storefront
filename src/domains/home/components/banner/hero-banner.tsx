import { HeroBannerCarousel } from "@/components/banner/banner-carousel"
import { getBannerGroupByCode } from "@/lib/api/pim/banner"
import { getProductByMasterId } from "@/lib/api/pim/products"
import type { BannerDto } from "@/lib/types/dto/pim"
import type { Banner, BannerGroup } from "@/lib/types/ui/product"
import sortBy from "lodash/sortBy"

export const MOCK_BANNER_GROUP: BannerGroup = {
  id: "group_001",
  code: "MAIN_HERO",
  title: "메인 히어로 배너",
  category: "MAIN",
  pcWidth: 0,
  pcHeight: 0,
  mobileWidth: 0,
  mobileHeight: 0,
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
  // const bannerGroup: BannerGroup = await getBannerGroupByCode("MAIN_HERO")
  // const activeBanners: BannerDto[] = sortBy(bannerGroup.banners, [
  //   "sortOrder",
  // ]).filter((banner) => {
  //   const now = new Date().getTime()
  //   const start = new Date(banner.displayStartAt ?? 0).getTime()
  //   const end = new Date(banner.displayEndAt ?? 0).getTime()

  //   return banner.isActive && start <= now && end >= now
  // })

  // // 배너마다 연결된 상품 상세 정보 가져오기
  // todo: master 다중조회 api 완성시 연결

  return (
    <div className="pt-4 pb-4 md:pb-[87px]">
      <HeroBannerCarousel
        banners={MOCK_BANNER_GROUP.banners}
        pcWidth={MOCK_BANNER_GROUP.pcWidth}
        pcHeight={MOCK_BANNER_GROUP.pcHeight}
        mobileWidth={MOCK_BANNER_GROUP.mobileWidth}
        mobileHeight={MOCK_BANNER_GROUP.mobileHeight}
        // bannersWithProducts={bannersWithProducts} // todo: add bannersWithProducts
      />
    </div>
  )
}
