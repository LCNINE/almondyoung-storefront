"use client"

import { Button } from "@components/common/ui/button"
import { Checkbox } from "@components/common/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/common/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@components/common/ui/drawer"
import { Form } from "@components/common/ui/form"
import { Input } from "@components/common/ui/input"
import { Label } from "@components/common/ui/label"
import { ScrollArea } from "@components/common/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/common/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { agreements } from "@lib/data/agreements"
import { UserDetail } from "@lib/types/ui/user"
import { format } from "date-fns"
import { ChevronRight, RotateCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm, useFormContext } from "react-hook-form"
import SignatureCanvas from "react-signature-canvas"
import { v4 as uuidv4 } from "uuid"
import z from "zod"
import { maskAccountNumber } from "../utils/mask-account-number"
import { formatPhoneNumber } from "react-phone-number-input"

const billingAgreementFormSchema = z
  .object({
    electronicTransaction: z.boolean(),
    privacyPolicy: z.boolean(),
    thirdPartySharing: z.boolean(),
    billingDate: z.string().min(1, "결제일을 선택해주세요"),
    birthDate: z.string().min(1, "생년월일을 입력해주세요"),
    signature: z.instanceof(File, {
      message: "서명을 해주세요.",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.electronicTransaction) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "전자금융거래 이용약관 동의는 필수입니다",
        path: ["electronicTransaction"],
      })
    }

    if (!data.privacyPolicy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "개인정보 수집 및 이용 동의는 필수입니다",
        path: ["privacyPolicy"],
      })
    }

    if (!data.thirdPartySharing) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "개인정보 제3자 제공 동의는 필수입니다",
        path: ["thirdPartySharing"],
      })
    }
  })

export type BillingAgreementFormSchema = z.infer<
  typeof billingAgreementFormSchema
>
/**
 * 정기결제 동의서 컴포넌트
 */
export default function BillingAgreementForm({ user }: { user: UserDetail }) {
  const form = useForm<BillingAgreementFormSchema>({
    resolver: zodResolver(billingAgreementFormSchema),
    defaultValues: {
      electronicTransaction: false, // 전자금융거래 이용약관 동의
      privacyPolicy: false, // 개인정보 수집 및 이용 동의
      thirdPartySharing: false, // 개인정보 제3자 제공 동의
      billingDate: "10",
      birthDate: "",
      signature: undefined,
    },
  })

  const [isSignatureModalOpen, setIsSignatureModalOpen] =
    useState<boolean>(false)

  useEffect(() => {
    if (user.profile?.birthDate) {
      form.setValue("birthDate", format(user.profile.birthDate, "yyyy-MM-dd"))
    }
  }, [user.profile?.birthDate])

  // 1일부터 28일까지 선택 옵션 생성
  const dayOptions = Array.from({ length: 28 }, (_, i) => i + 1)

  const handleSubmit = async (data: BillingAgreementFormSchema) => {
    // const formData = new FormData()

    // formData.append("payerName", user.username || "")
    // formData.append("phone", user.profile?.phoneNumber?.replace(/\D/g, "") || "")
    // formData.append("paymentCompany", BANK_CODE_MAP[bankData.bank] || "011")
    // formData.append("paymentNumber", bankData.accountNumber)
    // formData.append("payerNumber", payerNumber.replace(/\D/g, ""))

    console.log(data)

    // await onboardHmsBnpl(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <ScrollArea className="h-64 sm:h-96">
          <section className="flex">
            <div className="flex-1 space-y-2">
              <div>
                <Label className="text-sm font-medium">결제 신청인</Label>
              </div>

              <div>
                <Label className="text-sm font-medium">회사명</Label>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  결제자 휴대폰 번호
                </Label>
              </div>

              <div>
                <Label className="text-sm font-medium">계좌번호</Label>
              </div>

              <div>
                <Label className="text-sm font-medium">예금주(소유주)명</Label>
              </div>
            </div>

            <div className="flex-2 space-y-2">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-sm font-medium">블랙속눈썹</p>
              <p className="text-sm font-medium">
                {formatPhoneNumber(user.profile?.phoneNumber || "")}
              </p>
              <p className="text-sm font-medium">
                우리은행 {maskAccountNumber("1234567890123456")}
              </p>
              <p className="text-sm font-medium">정중식</p>
            </div>
          </section>
          <section className="mt-4 flex gap-4 py-2">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">결제자 생년월일</Label>
              <Input
                type="text"
                placeholder="YYYY-MM-DD"
                required
                value={form.watch("birthDate")}
                onChange={(e) => form.setValue("birthDate", e.target.value)}
                className="bg-gray-10"
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">결제일</Label>
              <Select
                value={form.watch("billingDate")}
                onValueChange={(value) => form.setValue("billingDate", value)}
              >
                <SelectTrigger className="w-full rounded-none border-2 bg-white shadow-none">
                  <SelectValue placeholder="매월 10일" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {dayOptions.map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      매월 {day}일
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          <section className="space-y-2 py-2">
            <Label className="text-sm font-medium">현금영수증 신청</Label>

            <div className="flex gap-9">
              <div className="flex items-center gap-2">
                <Checkbox id="bank-auto-receipt" className="cursor-pointer" />
                <Label
                  className="cursor-pointer text-sm font-normal"
                  htmlFor="bank-auto-receipt"
                >
                  은행자동 이체 시 자동 발행
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="business-number-same"
                  className="cursor-pointer"
                />
                <Label
                  className="cursor-pointer text-sm font-normal"
                  htmlFor="business-number-same"
                >
                  사업자번호 동일
                </Label>
              </div>
            </div>
          </section>

          <section className="mt-4 space-y-2 py-2">
            <Label className="text-sm font-medium">현금영수증 수신 email</Label>

            <Input type="email" placeholder="example@gmail.com" />
          </section>

          {/* 약관 동의 섹션 */}
          <section className="mt-4">
            {agreements.slice(2, 5).map((agreement) => (
              <AgreementForm
                key={agreement.id}
                agreement={agreement}
                checked={
                  !!form.watch(agreement.id as keyof BillingAgreementFormSchema)
                }
                onCheckedChange={(checked) =>
                  form.setValue(
                    agreement.id as keyof BillingAgreementFormSchema,
                    checked
                  )
                }
              />
            ))}
          </section>
        </ScrollArea>

        <section className="mt-5 space-y-3 border-t pt-4">
          {Object.keys(form.formState.errors).length > 0 ? (
            <p className="text-xs text-red-500">
              {
                form.formState.errors[
                  Object.keys(
                    form.formState.errors
                  )[0] as keyof BillingAgreementFormSchema
                ]?.message
              }
            </p>
          ) : (
            <p className="text-xs font-normal">
              위와 같이 정기결제 신청에 동의합니다.
            </p>
          )}

          <Button
            type="button"
            variant={"default"}
            className={`w-full cursor-pointer ${form.formState.errors.signature && "animate-pulse"}`}
            onClick={() => {
              form.trigger([
                "electronicTransaction",
                "privacyPolicy",
                "thirdPartySharing",
              ])
              setIsSignatureModalOpen(true)
            }}
          >
            전자서명
          </Button>

          <Button
            type="submit"
            variant={"default"}
            className="w-full cursor-pointer"
          >
            정기결제 신청
          </Button>
        </section>

        <SignaturePad
          user={user}
          isOpen={isSignatureModalOpen}
          onClose={() => setIsSignatureModalOpen(false)}
          onComplete={(signatureFile) => {
            form.setValue("signature", signatureFile)
          }}
        />
      </form>
    </Form>
  )
}

function AgreementForm({
  agreement,
  checked,
  onCheckedChange,
}: {
  agreement: {
    id: string
    name: string
    content: string | null
  }
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const form = useFormContext<BillingAgreementFormSchema>()

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3 rounded-lg p-0">
        <Controller
          control={form.control}
          name={agreement.id as keyof BillingAgreementFormSchema}
          render={({ field }) => (
            <>
              <Checkbox
                id={agreement.id}
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)

                  field?.name &&
                    form.trigger([
                      "electronicTransaction",
                      "privacyPolicy",
                      "thirdPartySharing",
                    ])
                }}
                className={
                  form.formState.errors[
                    agreement.id as keyof BillingAgreementFormSchema
                  ]
                    ? "border-red-500"
                    : ""
                }
              />
              <Label
                htmlFor={agreement.id}
                className={`flex flex-1 cursor-pointer items-center ${form.formState.errors[agreement.id as keyof BillingAgreementFormSchema] ? "text-red-500" : ""}`}
              >
                <span className="flex-1 text-sm">{agreement.name}</span>
              </Label>
            </>
          )}
        />

        {agreement.content && (
          <Drawer>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-transparent hover:text-gray-50"
              >
                <ChevronRight className="size-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{agreement.name}</DrawerTitle>
                <DrawerDescription>필수 동의 항목입니다.</DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-[60vh] px-4">
                <div className="pb-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {agreement.content}
                </div>
              </ScrollArea>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">닫기</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  )
}

interface SignaturePadProps {
  user: UserDetail
  onComplete: (signatureFile: File) => void
  isOpen: boolean
  onClose: () => void
}

export function SignaturePad({
  user,
  onComplete,
  isOpen,
  onClose,
}: SignaturePadProps) {
  const form = useFormContext<BillingAgreementFormSchema>()

  const sigCanvas = useRef<SignatureCanvas>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  const clear = () => {
    sigCanvas.current?.clear()
    setIsEmpty(true)
  }

  const generateFileName = () => {
    const timestamp = format(new Date(), "yyyyMMdd-HHmmss")
    const uuid = uuidv4().slice(0, 4)
    return `signature-${user.id ?? "unknown"}-${timestamp}-${uuid}.png`
  }

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("서명을 입력해주세요")
      return
    }

    const fileName = generateFileName()

    // Canvas → Blob → File 변환
    sigCanvas.current?.getCanvas().toBlob((blob) => {
      if (blob) {
        const file = new File([blob], fileName, { type: "image/png" })

        form.clearErrors("signature")
        onComplete(file)
        onClose()
      }
    }, "image/png")
  }

  // 기존 서명을 캔버스에 로드
  useEffect(() => {
    if (!isOpen) return

    // 모달이 열릴 때마다 캔버스 초기화
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      setIsEmpty(true)
    }

    const signature = form.watch("signature")

    if (signature && sigCanvas.current) {
      // File 객체를 Data URL로 변환
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        if (dataUrl && sigCanvas.current) {
          // 캔버스 초기화 후 이미지 그리기
          sigCanvas.current.clear()
          sigCanvas.current.fromDataURL(dataUrl)
          setIsEmpty(false)
        }
      }
      reader.readAsDataURL(signature)
    }
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>전자서명</DialogTitle>
          <DialogDescription>
            아래 영역에 서명을 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-10 relative rounded-lg">
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: 500,
              height: 200,
              className: "w-full",
              style: { touchAction: "none" }, // 모바일 터치 스크롤 방지
            }}
            onBegin={() => setIsEmpty(false)}
          />

          {isEmpty && (
            <p className="text-gray-40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-medium">
              여기에 서명하세요
            </p>
          )}

          <div className="absolute right-4 bottom-4">
            <RotateCw
              className="size-5 cursor-pointer"
              onClick={clear}
              color="#A86500"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            onClick={save}
            disabled={isEmpty}
            className="w-full sm:w-auto"
          >
            서명 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
