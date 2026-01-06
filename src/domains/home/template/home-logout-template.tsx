import { homeSectionsConfig } from "@lib/data/home-sections-config"
import type { CategoryTreeNodeDto } from "@lib/types/dto/pim"
import { MembershipBanner } from "../components/banner/membership-banner"
import { ProductListSection } from "../components/list/product-list-section"
import SectionHeader from "../components/list/section-header"
import { CategoryBestSection } from "../components/sections/category-best-section"

interface HomeLogoutTemplateProps {
  initialCategories: CategoryTreeNodeDto[]
}

/*───────────────────────────────────────────────
 * 비로그인 사용자용
 *───────────────────────────────────────────────*/
export function HomeLogoutTemplate({
  initialCategories,
}: HomeLogoutTemplateProps) {
  return (
    <div className="w-full">
      {/* 카테고리별 제품 섹션 */}
      <ProductListSection>
        <CategoryBestSection initialCategories={initialCategories} />
      </ProductListSection>

      {/* 멤버십 배너 섹션 */}
      <ProductListSection>
        <MembershipBanner className="mb-4" />
      </ProductListSection>

      {/* 신상품 섹션 */}
      {/* <ProductListSection>
        <SectionHeader
          title={homeSectionsConfig.newProducts.title}
          description={homeSectionsConfig.newProducts.description}
        />
        {isLoadingSections.newProducts ? (
          <div className="py-8 text-center text-gray-500">로딩 중...</div>
        ) : (
          <ProductList
            products={sectionProducts.newProducts || []}
            renderCard={(product) => <BasicProductCard product={product} />}
          />
        )}
      </ProductListSection> */}

      {/* 웰컴딜 섹션 */}
      {/* {/* <ProductListSection>
        <MembershipBanner className="mb-4" />
        <SectionHeader
          title={homeSectionsConfig.welcomeDeal.title}
          description={homeSectionsConfig.welcomeDeal.description}
        />
        {isLoadingSections.welcomeDeal ? (
          <div className="py-8 text-center text-gray-500">로딩 중...</div>
        ) : (
          <ProductList
            products={sectionProducts.welcomeDeal || []}
            renderCard={(product) => <BasicProductCard product={product} />}
          />
        )}
      </ProductListSection> */}

      {/* 타임세일 섹션 */}
      <ProductListSection>
        <SectionHeader
          title="타임세일"
          description="타임세일 전체 제품을 만나보세요"
        />
        {/* <CategoryBadgeTabs
          categories={categories}
          initialCategoryId="first"
          onCategorySelect={setSelectedTimeSaleCategory}
        />
        <div className="mt-6">
          {isLoadingTimeSaleProducts ? (
            <div className="py-8 text-center text-gray-500">로딩 중...</div>
          ) : timeSaleProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>해당 카테고리에 등록된 상품이 없습니다.</p>
            </div>
          ) : (
            <ProductList
              products={timeSaleProducts}
              renderCard={(product) => (
                <DiscountProductCard product={product} minWidth={100} />
              )}
            />
          )}
        </div> */}
      </ProductListSection>

      {/* 디지털 템플릿 섹션 */}
      {/* {(sectionProducts.digitalTemplate?.length || 0) > 0 && (
        <ProductListSection>
          <SectionHeader
            title={homeSectionsConfig.digitalTemplate.title}
            description={homeSectionsConfig.digitalTemplate.description}
          />
          {isLoadingSections.digitalTemplate ? (
            <div className="py-8 text-center text-gray-500">로딩 중...</div>
          ) : (
            <ProductList
              products={sectionProducts.digitalTemplate || []}
              renderCard={(product) => <BasicProductCard product={product} />}
            />
          )}
        </ProductListSection>
      )} */}

      {/* 메인 배너 캐러셀 - TODO: 실제 배너 데이터 API 연동 필요 */}
      {/* <div className="w-full lg:py-8">
        <div className="container mx-auto max-w-[1360px] px-4 md:px-[40px]">
          <BannerCarousel
            slides={[]}
            height="120px"
            autoPlay={true}
            autoPlayInterval={6000}
            className="lg:overflow-hidden lg:rounded-2xl"
          />
        </div>
      </div> */}

      {/* 인기 급상승 제품 섹션 */}
      <ProductListSection className="bg-linear-to-b from-purple-50 to-white">
        <SectionHeader
          title={homeSectionsConfig.hotRising.title}
          description={homeSectionsConfig.hotRising.description}
        />
        {/* {isLoadingSections.hotRising ? (
          <div className="py-8 text-center text-gray-500">로딩 중...</div>
        ) : (
          <ProductList
            products={sectionProducts.hotRising || []}
            renderCard={(product, index) => (
              <RankProductCard product={product} rank={index + 1} />
            )}
          />
        )} */}
      </ProductListSection>

      {/* 재구매 많은 제품 섹션 */}
      <ProductListSection>
        <SectionHeader
          title={homeSectionsConfig.frequentRebuy.title}
          description={homeSectionsConfig.frequentRebuy.description}
        />
        {/* {isLoadingSections.frequentRebuy ? (
          <div className="py-8 text-center text-gray-500">로딩 중...</div>
        ) : (
          <ProductList
            products={sectionProducts.frequentRebuy || []}
            renderCard={(product, index) => (
              <BasicProductCard product={product} />
            )}
          />
        )} */}
      </ProductListSection>

      {/* SEO를 위한 추가 컨텐츠 (숨김 처리 가능) */}
      <div className="sr-only">
        <h1>아몬드영 - 최저가 미용재료 MRO 쇼핑몰</h1>
        <p>미용 전문 재료를 최저가로 빠르게 구매할 수 있는 아몬드영입니다.</p>
        <p>
          속눈썹, 네일, 왁싱, 반영구, 헤어, 타투, 피부미용 전문 재료를 한 곳에서
          만나보세요.
        </p>
      </div>
    </div>
  )
}
