"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@components/common/ui/dialog"
import { PhoneVerificationStep } from "../registration-steps/phone-verification-step"
import BusinessVerificationStep from "../registration-steps/business-verification-step"
import AccountRegistrationStep from "../registration-steps/account-registration-step"
import { StepIndicator } from "../registration-steps"

type Step = "phone" | "business" | "account"

interface RegistrationData {
  phone?: { verified: boolean; phoneNumber: string }
  business?: { verified: boolean; businessNumber: string; companyName: string }
  account?: { bank: string; accountNumber: string }
}

// 결제 수단 등록 모달 컴포넌트
export default function PaymentRegistrationModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [currentStep, setCurrentStep] = useState<Step>("phone")
  const [data, setData] = useState<RegistrationData>({})

  const steps = [
    { id: "phone", label: "본인인증" },
    { id: "business", label: "사업자대인" },
    { id: "account", label: "계좌등록 및 동의" },
  ] as const

  const handlePhoneComplete = (phoneData: RegistrationData["phone"]) => {
    setData((prev) => ({ ...prev, phone: phoneData }))
    setCurrentStep("business")
  }

  const handleBusinessComplete = (
    businessData: RegistrationData["business"]
  ) => {
    setData((prev) => ({ ...prev, business: businessData }))
    setCurrentStep("account")
  }

  const handleAccountComplete = async (
    accountData: RegistrationData["account"]
  ) => {
    setData((prev) => ({ ...prev, account: accountData }))
    // API 호출 후 완료 처리
    onOpenChange(false)
  }

  const handleClose = () => {
    setCurrentStep("phone")
    setData({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* 단계 표시 */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* 단계별 컨텐츠 */}
        {currentStep === "phone" && (
          <PhoneVerificationStep onComplete={handlePhoneComplete} />
        )}
        {currentStep === "business" && (
          <BusinessVerificationStep onComplete={handleBusinessComplete} />
        )}
        {currentStep === "account" && (
          <AccountRegistrationStep onComplete={handleAccountComplete} />
        )}
      </DialogContent>
    </Dialog>
  )
}
