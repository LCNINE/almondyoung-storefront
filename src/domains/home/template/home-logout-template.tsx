import type { CategoryTreeNodeDto } from "@lib/types/dto/pim"
import { HeroBanner } from "../components/banner/hero-banner"
import { LoginPromptBanner } from "../components/banner/login-prompt-banner"
import MiddleBanner from "../components/banner/middle-banner"
import { CategoryBestSection } from "../components/sections/category-best"
import { ProductListSection } from "../components/shared/product-list-section"

interface HomeLogoutTemplateProps {
  initialCategories: CategoryTreeNodeDto[]
}

/*──────────────────
 * 비로그인 사용자용
 *─────────────────*/
export function HomeLogoutTemplate({
  initialCategories,
}: HomeLogoutTemplateProps) {
  return (
    <div className="w-full">
      {/* 메인 히어로 배너 */}
      <HeroBanner />

      {/* 로그인 유도 배너 */}
      <LoginPromptBanner />

      {/* 카테고리별 제품 섹션 */}
      <ProductListSection>
        <CategoryBestSection initialCategories={initialCategories} />
      </ProductListSection>

      {/* 중간 배너 섹션 */}
      <ProductListSection>
        <MiddleBanner className="mb-4" />
      </ProductListSection>
    </div>
  )
}
