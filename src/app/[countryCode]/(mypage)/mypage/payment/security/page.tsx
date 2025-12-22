import { Spinner } from "@components/common/spinner"
import { WithHeaderLayout } from "@components/layout"
import MypageLayout from "@components/layout/mypage-layout"
import ProtectedRoute from "@components/protected-route"
import { getMyBusiness } from "@lib/api/users/business"
import { fetchMe } from "@lib/api/users/me"
import { getVerificationStatus } from "@lib/api/users/verification-status"
import { getBnplProfiles, getPinStatus } from "@lib/api/wallet"
import PinChangeForm from "domains/payment/components/security-pin/pin-change-form"
import PinSetupForm from "domains/payment/components/security-pin/pin-setup-form"
import { Suspense } from "react"
import VerificationModal from "./(components)/verification-modal"

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
  const currentUser = await fetchMe()
  const pinStatus = await getPinStatus()
  const verificationStatus = await getVerificationStatus() // step 별 진행 상태, 결제 수단 등록할 때 인증 정보 steps 별 진행 상태 확인용
  const businessInfo = await getMyBusiness() // 사업자 정보 조회
  const bnplProfiles = await getBnplProfiles() // 나중결제 계좌 조회

  // 휴대폰 인증 안하면 휴대폰 인증 모달 띄움
  if (!currentUser.profile?.phoneNumber) {
    return (
      <VerificationModal
        currentUser={currentUser}
        verificationStatus={verificationStatus}
        businessInfo={businessInfo}
        bnplProfiles={bnplProfiles ?? []}
      />
    )
  }

  // 새로 등록
  if (pinStatus.status === "NONE") {
    return <PinSetupForm />
  }

  // PIN 변경
  if (pinStatus.status === "ACTIVE") {
    return <PinChangeForm />
  }

  return null
}
