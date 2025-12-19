import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"
import { fetchMe } from "@lib/api/users/me"

export default async function SecurityPage() {
  const currentUser = await fetchMe()

  return (
    <WithHeaderLayout
      config={{
        showDesktopHeader: true,
        showMobileHeader: false,
        showMobileSubBackHeader: true,
        mobileSubBackHeaderTitle: "다운로드",
      }}
    >
      <MypageLayout>테스트</MypageLayout>
    </WithHeaderLayout>
  )
}
