import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"
import { PaymentManagement } from "domains/payment/payment-management"
import ProtectedRoute from "@components/protected-route"
import { fetchMe } from "@lib/api/users/me"

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <WithHeaderLayout
        config={{
          showDesktopHeader: true,
          showMobileHeader: false,
          showMobileSubBackHeader: true,
          mobileSubBackHeaderTitle: "결제수단 관리",
        }}
      >
        <MypageLayout>
          <PaymentContainer />
        </MypageLayout>
      </WithHeaderLayout>
    </ProtectedRoute>
  )
}

async function PaymentContainer() {
  const currentUser = await fetchMe()

  return <PaymentManagement currentUser={currentUser} />
}
