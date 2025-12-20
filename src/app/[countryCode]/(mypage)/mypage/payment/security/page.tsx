import { Spinner } from "@components/common/spinner"
import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"
import ProtectedRoute from "@components/protected-route"
import { getPinStatus } from "@lib/api/wallet"
import PinChangeForm from "domains/payment/components/security-pin/pin-change-form"
import PinSetupForm from "domains/payment/components/security-pin/pin-setup-form"
import { Suspense } from "react"

export default async function SecurityPage() {
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
          <Suspense
            fallback={
              <div className="flex h-56 items-center justify-center text-center">
                <Spinner size="lg" color="gray" />
              </div>
            }
          >
            <SucurityManagement />
          </Suspense>
        </MypageLayout>
      </WithHeaderLayout>
    </ProtectedRoute>
  )
}

async function SucurityManagement() {
  const pinStatus = await getPinStatus()

  // 새로 등록
  if (pinStatus.status === "NONE") {
    return <PinSetupForm />
  }

  // 변경 필요
  if (pinStatus.status === "ACTIVE") {
    return <PinChangeForm />
  }

  return null
}
