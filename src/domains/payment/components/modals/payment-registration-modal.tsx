"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@components/common/ui/dialog"
import { useState } from "react"
import AccountStep from "../registration-steps/account-step"
import BirthdateStep from "../registration-steps/birthdate-step"
import BusinessStep from "../registration-steps/business-step"
import { PhoneStep } from "../registration-steps/phone-step"
import { StepIndicator } from "../registration-steps/step-Indicator"

type Step = "birthDate" | "phone" | "business" | "account"

interface RegistrationData {
  phone?: { verified: boolean; phoneNumber: string }
  business?: { verified: boolean; businessNumber: string; companyName: string }
  account?: { bank: string; accountNumber: string }
}

// 결제 수단 등록 모달 컴포넌트
export default function PaymentRegistrationModal({
  open,
  onOpenChange,
  isUserBirthDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isUserBirthDate: boolean
}) {
  const [currentStep, setCurrentStep] = useState<Step>("birthDate")
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
    setCurrentStep("birthDate")
    setData({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">결제수단 등록</DialogTitle>

        {/* 단계 표시 */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* 단계별 컨텐츠 */}
        {currentStep === "birthDate" && (
          <BirthdateStep onComplete={() => setCurrentStep("phone")} />
        )}

        {currentStep === "phone" && (
          <PhoneStep onComplete={handlePhoneComplete} />
        )}
        {currentStep === "business" && (
          <BusinessStep onComplete={handleBusinessComplete} />
        )}
        {currentStep === "account" && (
          <AccountStep onComplete={handleAccountComplete} />
        )}
      </DialogContent>
    </Dialog>
  )
}
