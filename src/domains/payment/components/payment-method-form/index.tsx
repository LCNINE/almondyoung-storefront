"use client"

import { Card, CardContent } from "@components/common/ui/card"
import { cn } from "@lib/utils"
import { ChevronRight, CreditCard } from "lucide-react"
import { useState } from "react"
import BANKS from "./banks.data.json"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/common/ui/dialog"
import { usePaymentMethodModalStore } from "../store/payment-method-modal-store"
import { ScrollArea } from "@components/common/ui/scroll-area"
import { Button } from "@components/common/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/common/ui/select"
import { Label } from "@components/common/ui/label"
import { Input } from "@components/common/ui/input"
import BillingAgreementForm from "./billing-agreement-form"
import { UserDetail } from "@lib/types/ui/user"

// 결제 수단 선택 모달 컴포넌트
export default function PaymentMethodForm({ user }: { user: UserDetail }) {
  const { isOpen, openModal, closeModal } = usePaymentMethodModalStore()

  const [step, setStep] = useState<"method" | "bank" | "account" | "agreement">(
    "method"
  )
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null)

  const handleBankSelect = (bank: BankInfo) => {
    setSelectedBank(bank)
    setStep("account")
  }

  const renderContent = () => {
    switch (step) {
      // 결제 방법 선택 컴포넌트
      case "method":
        return (
          <Card
            className="cursor-pointer border border-none shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg"
            onClick={() => setStep("bank")}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div
                className="flex items-center gap-3"
                onClick={() => setStep("bank")}
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500">
                  <CreditCard className="size-5 text-white" />
                </div>
                <span className="text-sm font-bold">은행계좌</span>
              </div>
              <ChevronRight className="size-5" />
            </CardContent>
          </Card>
        )

      // 은행 선택하는 은행 리스트 컴포넌트
      case "bank":
        return <BankSelector onSelect={handleBankSelect} />

      // 은행 계좌 조회 폼 컴포넌트
      case "account":
        return (
          <BankAccountLookupForm
            bank={selectedBank}
            onSelect={handleBankSelect}
            onNextStep={() => setStep("agreement")}
          />
        )

      // 결제 동의 폼 컴포넌트
      case "agreement":
        return <BillingAgreementForm user={user} />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="flex min-h-2/3 flex-col overflow-hidden sm:max-w-md">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-base font-semibold">
            결제수단 등록
          </DialogTitle>
        </DialogHeader>

        <div
          className={cn(
            `bg-gray-10 border-t-gray-20 absolute top-16 right-0 bottom-0 left-0 h-full w-full flex-1 border-t p-4`,
            step === "agreement" && "bg-gray-0"
          )}
        >
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface BankInfo {
  code: string
  name: string
}

/**
 * 은행 선택 컴포넌트
 */
function BankSelector({ onSelect }: { onSelect: (bank: BankInfo) => void }) {
  return (
    <>
      <p className="mb-4 text-center text-sm">
        본인 명의의 계좌만 등록 가능합니다.
      </p>
      <ScrollArea className="h-80">
        <div className="grid grid-cols-3 gap-3">
          {BANKS.map((bank) => (
            <Button
              variant="outline"
              key={bank.code}
              onClick={() => onSelect(bank)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 transition"
              )}
            >
              <span className="text-[15px] font-medium">{bank.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}

/**
 * 은행 계좌 조회 폼 컴포넌트
 */
function BankAccountLookupForm({
  bank,
  onSelect,
  onNextStep,
}: {
  bank: BankInfo | null
  onSelect: (bank: BankInfo) => void
  onNextStep: () => void
}) {
  const handleSearch = () => {}

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">은행</Label>
          <Select
            onValueChange={(value) => onSelect({ code: value, name: value })}
            defaultValue={bank?.code}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="은행 선택" />
            </SelectTrigger>

            <SelectContent className="max-h-60">
              {BANKS.map((bank) => (
                <SelectItem key={bank.code} value={bank.code}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium" htmlFor="account-number">
            계좌번호
          </Label>
          <Input
            id="account-number"
            placeholder="계좌번호를 입력해주세요"
            maxLength={14}
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => {
              // 숫자만 허용
              e.target.value = e.target.value.replace(/[^0-9]/g, "")
            }}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            className="cursor-pointer px-8 py-2"
            onClick={handleSearch}
          >
            조회
          </Button>
        </div>
      </div>

      <BankAccountLookupResult
        bank={bank}
        onSelect={(bank: BankInfo) => {
          onSelect(bank)
          onNextStep()
        }}
      />
    </>
  )
}

// 계좌 인증 조회 결과 컴포넌트
function BankAccountLookupResult({
  bank,
  onSelect,
}: {
  bank: BankInfo | null
  onSelect: (bank: BankInfo) => void
}) {
  if (!bank) return null

  return (
    <Card
      className="mt-8 cursor-pointer border border-none shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md"
      onClick={() => onSelect(bank)}
    >
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3" onClick={() => onSelect(bank)}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500">
            <CreditCard className="size-5 text-white" />
          </div>
          <span className="text-sm font-bold">은행계좌</span>
        </div>
        <ChevronRight className="size-5" />
      </CardContent>
    </Card>
  )
}
