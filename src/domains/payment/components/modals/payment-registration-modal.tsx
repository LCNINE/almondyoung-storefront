"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/common/ui/dialog"
import { useEffect, useState } from "react"
import AccountStep from "../registration-steps/account-step"
import BirthdateStep from "../registration-steps/birthdate-step"
import BusinessStep from "../registration-steps/business-step"
import { PhoneStep } from "../registration-steps/phone-step"
import { StepIndicator } from "../registration-steps/step-Indicator"
import { UserDetail } from "@lib/types/ui/user"

type Step = "birthDate" | "phone" | "business" | "account"

interface RegistrationData {
  phone?: { verified: boolean; phoneNumber: string }
  business?: {
    verified: boolean
    businessNumber: string
    ceoName: string
    file: File | null
  }
  account?: { bank: string; accountNumber: string }
}

// 결제 수단 등록 모달 컴포넌트
export default function PaymentRegistrationModal({
  open,
  onOpenChange,
  isUserBirthDate,
  user,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isUserBirthDate: boolean
  user: UserDetail
}) {
  // const [currentStep, setCurrentStep] = useState<Step>(() =>
  //   isUserBirthDate ? "phone" : "birthDate"
  // )
  const [currentStep, setCurrentStep] = useState<Step>(() => "business")
  const [data, setData] = useState<RegistrationData>({})

  // useEffect(() => {
  //   if (isUserBirthDate) {
  //     setCurrentStep("phone")
  //   } else {
  //     setCurrentStep("birthDate")
  //   }
  // }, [isUserBirthDate])

  const steps = [
    { id: "phone", label: "본인인증" },
    { id: "business", label: "사업자 확인" },
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
    setCurrentStep(isUserBirthDate ? "phone" : "birthDate")
    setData({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* 헤더 */}
        <DialogHeader>
          <DialogTitle>
            {steps.find((step) => step.id === currentStep)?.label}
          </DialogTitle>
        </DialogHeader>

        {/* 단계 표시 */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* 단계별 컨텐츠 */}
        {currentStep === "birthDate" && (
          <BirthdateStep onComplete={() => setCurrentStep("phone")} />
        )}

        {currentStep === "phone" && (
          <PhoneStep onComplete={handlePhoneComplete} user={user} />
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
