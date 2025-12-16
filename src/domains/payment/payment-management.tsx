"use client"

import { PageTitle } from "@components/common/page-title"
import type { UserVerificationStatusDto } from "@lib/types/dto/users"
import type { BnplProfileDto } from "@lib/types/dto/wallet"
import type { BusinessInfo, UserDetail } from "@lib/types/ui/user"
import BankAccountWizard from "./components/bank-account-wizard/bank-account-wizard"
import BnplSection from "./components/bnpl-section"
import BnplVerificationWizard from "./components/bnpl-verification-wizard/bnpl-verification-wizard"
import PointSection from "./components/point-section"
import AccountSection from "./components/sections/account-section"
import PaymentMenuList from "./components/sections/payment-menu-list"
import PendingPointsSection from "./components/sections/pending-points-section"

export function PaymentManagement({
  currentUser,
  verificationStatus,
  businessInfo,
  bnplProfiles,
}: {
  currentUser: UserDetail
  verificationStatus: UserVerificationStatusDto
  businessInfo: BusinessInfo | null
  bnplProfiles: BnplProfileDto[]
}) {
  return (
    <div className="p x-3 rounded-xl bg-white pt-4 pb-9 md:px-6">
      <PageTitle>결제수단 관리</PageTitle>

      <div className="bg-gray-10 mt-5 mb-4 space-y-4 p-4">
        {/* 나중결제 내역 */}
        <BnplSection bnplProfiles={bnplProfiles} />

        {/* 적립금 섹션 */}
        <PointSection />

        {/* 계좌 섹션 */}
        <AccountSection />

        {/* 적립 예정인 적립금 섹션 */}
        <PendingPointsSection />
      </div>

      {/* 하단 메뉴 리스트 */}
      <PaymentMenuList />

      {/* 등록 모달 */}
      <BnplVerificationWizard
        user={currentUser}
        verificationStatus={verificationStatus}
        businessInfo={businessInfo}
        bnplProfiles={bnplProfiles}
      />

      {/* 결제 수단 등록 모달 */}
      <BankAccountWizard user={currentUser} />
    </div>
  )
}
