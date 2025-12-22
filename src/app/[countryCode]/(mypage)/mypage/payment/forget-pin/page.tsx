import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"
import ProtectedRoute from "@components/protected-route"
import ForgetPin from "domains/payment/components/forget-pin"

export default async function ForgetPinPage() {
  return (
    <ProtectedRoute>
      <WithHeaderLayout
        config={{
          showDesktopHeader: true,
          showMobileHeader: false,
          showMobileSubBackHeader: true,
          mobileSubBackHeaderTitle: "비밀번호 설정",
        }}
      >
        <MypageLayout>
          <ForgetPin />
        </MypageLayout>
      </WithHeaderLayout>
    </ProtectedRoute>
  )
}
