import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@/app/[countryCode]/(mypage)/_components/mypage-layout"
import { PageTitle } from "@/components/shared/page-title"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "회원정보 수정",
  description: "회원정보를 수정하세요",
}

export default function AccountProfilePage() {
  return (
    <WithHeaderLayout
      config={{
        showDesktopHeader: true,
        showMobileHeader: false,
        showMobileSubBackHeader: true,
        mobileSubBackHeaderTitle: "회원정보 수정",
      }}
    >
      <MypageLayout>
        <div className="bg-white px-3 py-4 md:min-h-screen md:px-6">
          <PageTitle>회원정보 수정</PageTitle>
          <div className="flex h-56 items-center justify-center text-center">
            <p className="text-gray-500">준비 중입니다</p>
          </div>
        </div>
      </MypageLayout>
    </WithHeaderLayout>
  )
}
