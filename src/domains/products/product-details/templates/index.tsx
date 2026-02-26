import { HttpTypes } from "@medusajs/types"
import { notFound } from "next/navigation"
import { ImageGallery } from "../components2/image-gallery"
import { SectionTabPanel, SectionTabs } from "../components2/section-nav"
import { SideBar } from "../components2/side-bar"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

export function ProductTemplate({
  product,
  region,
  countryCode,
}: ProductTemplateProps) {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="lg:bg-muted/50 min-h-screen bg-white">
      <div className="mx-auto max-w-[1360px] px-[15px] lg:px-[40px]">
        <div className="py-2 lg:flex lg:gap-4">
          {/* 메인 콘텐츠 */}
          <main className="w-full min-w-0 flex-1 pb-24 lg:pb-0">
            <ImageGallery product={product} />

            <SectionTabs>
              <SectionTabPanel value="detail">
                <div>상세정보 콘텐츠</div>
              </SectionTabPanel>
              <SectionTabPanel value="review">
                <div>리뷰 콘텐츠</div>
              </SectionTabPanel>
              <SectionTabPanel value="qna">
                <div>Q&A 콘텐츠</div>
              </SectionTabPanel>
            </SectionTabs>
          </main>

          <SideBar
            brand={(product.metadata?.brand as string) ?? ""}
            productName={product.title ?? ""}
            product={product}
            countryCode={countryCode}
            handle={product.handle}
          />
        </div>
      </div>
    </div>
  )
}
