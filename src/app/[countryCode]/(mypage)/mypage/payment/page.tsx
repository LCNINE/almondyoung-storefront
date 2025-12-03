import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"

export default function PaymentPage() {
  return (
    <WithHeaderLayout
      config={{
        showDesktopHeader: true,
        showMobileHeader: false,
        showMobileSubBackHeader: true,
        mobileSubBackHeaderTitle: "결제수단 관리",
      }}
    >
      <MypageLayout>=</MypageLayout>
    </WithHeaderLayout>
  )
}
