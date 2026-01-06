import { ThemeManager } from "@components/common/theme-manager"
import ProtectedRoute from "@components/protected-route"
import { getProductList } from "@lib/api/medusa/products"
import { CategoryTreeNodeDto, getCategoryTree } from "@lib/api/pim"
import { fetchMe } from "@lib/api/users/me"
import { HomeLogoutTemplate } from "domains/home/template/home-logout-template"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "아몬드영 - 최저가 미용재료 MRO 쇼핑몰",
  description:
    "속눈썹, 네일, 왁싱, 반영구 등 미용 전문 재료를 최저가로 빠르게! 아몬드영에서 전문가용 재료를 만나보세요.",
  keywords: ["미용재료", "왁싱재료", "속눈썹부자재"],
}

export default async function Home() {
  // 카테고리 트리 조회
  let categories: CategoryTreeNodeDto[] = []

  const result = await getCategoryTree().catch(() => null)
  categories = result?.categories || []

  // const productList = await getProductList().catch(() => null)

  // todo: 로그인 사용자용 홈페이지 섹션들
  const user = await fetchMe().catch(() => null)

  return (
    <ProtectedRoute>
      <HomeLogoutTemplate
        initialCategories={categories}
        // products={productList.products}
      />

      {/* 테마 매니저 (개발 모드에서만 표시) */}
      {process.env.NODE_ENV === "development" && <ThemeManager />}
    </ProtectedRoute>
  )
}
