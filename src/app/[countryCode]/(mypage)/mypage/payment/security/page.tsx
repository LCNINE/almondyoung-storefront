import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"

export default function SecurityPage() {
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
