import { Spinner } from "@components/common/spinner"
import { Badge } from "@components/common/ui/badge"
import { Button } from "@components/common/ui/button"
import { Checkbox } from "@components/common/ui/checkbox"
import { Input } from "@components/common/ui/input"
import { Label } from "@components/common/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpApiError } from "@lib/api/api-error"
import { uploadFile } from "@lib/api/file/upload"
import {
  createBusiness,
  fetchExternalBusinessInfo,
} from "@lib/api/users/business/client"
import { BusinessInfo } from "@lib/types/dto/business"
import { FilesDto } from "@lib/types/dto/files"
import { useRouter } from "next/navigation"
import { useRef, useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
  businessNumber: z.string(),
  ceoName: z.string(),
  file: z.instanceof(File).optional(),
})

type BusinessFormData = z.infer<typeof schema>

// 사업자 인증 스템 컴포넌트
export default function BusinessStep({
  onComplete,
  businessInfo,
}: {
  onComplete: (data: {
    verified: boolean
    businessNumber: string
    ceoName: string
    file: File | null
  }) => void
  businessInfo: BusinessInfo
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [BusinessCheckStatus, setBusinessCheckStatus] = useState<
    "success" | "failed" | null
  >(null)

  // 외부조회로 사업자 정보 조회
  const [isExternalBusinessPending, startExternalBusinessTransition] =
    useTransition()

  // 사업자 정보 등록
  const [isCreateBusinessPending, startCreateBusinessTransition] =
    useTransition()

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessNumber: "",
      ceoName: "",
    },
  })

  const onSubmit = async (data: BusinessFormData) => {
    if (!BusinessCheckStatus && !form.watch("file")) {
      toast.error("사업자 정보 입력 또는 파일 첨부를 해주세요.")
      return
    }

    startCreateBusinessTransition(async () => {
      let fileRes: FilesDto | null = null

      if (form.watch("file")) {
        const formData = new FormData()

        formData.append("file", form.watch("file")!)
        formData.append("context", "business-verification-file")

        try {
          fileRes = await uploadFile(formData)
        } catch (error) {
          console.log("error:", error)
          if (error instanceof HttpApiError) {
            toast.error(error.message)
          } else {
            toast.error("파일 업로드 중 오류가 발생했습니다.")
          }

          return
        }
      }

      const res = await createBusiness({
        businessNumber: form.watch("businessNumber") ?? "",
        representativeName: form.watch("ceoName") ?? "",
        fileUrl: fileRes?.data?.url ?? undefined,
      })

      router.refresh()

      if (!form.watch("file")) {
        onComplete({
          verified: true,
          businessNumber: data.businessNumber,
          ceoName: data.ceoName,
          file: data.file ?? null,
        })
      }
    })
  }

  const handleExternalBusiness = async () => {
    if (!form.watch("businessNumber")) {
      toast.error("사업자등록번호를 입력해주세요.")
      form.setFocus("businessNumber")
      return
    }
    if (!form.watch("ceoName")) {
      toast.error("대표자 이름을 입력해주세요.")
      form.setFocus("ceoName")
      return
    }

    startExternalBusinessTransition(async () => {
      try {
        const res = await fetchExternalBusinessInfo(
          form.getValues("businessNumber"),
          form.getValues("ceoName")
        )

        if (res.success) {
          toast.success(
            '사업자 정보 조회가 완료되었습니다. 아래 "등록하기" 버튼을 눌러 사업자 정보를 등록해주세요.'
          )
          setBusinessCheckStatus("success")
        }
      } catch (error: any) {
        setBusinessCheckStatus("failed")
        if (error instanceof HttpApiError) {
          switch (error.data.message) {
            case "사업자번호는 10자리이어야 합니다.":
              toast.error("사업자등록번호는 10자리이어야 합니다.")
              form.setFocus("businessNumber")
              break
            case "대표자 이름이 일치하지 않습니다.":
              toast.error("대표자 이름이 일치하지 않습니다.")
              form.setFocus("ceoName")
              break
            default:
              toast.error(error.data.message || "조회 중 오류가 발생했습니다.")
          }
        } else {
          toast.error(error.message || "조회 중 오류가 발생했습니다.")
        }
      }
    })
  }

  // 파일 첨부 버튼 클릭 핸들러
  const handleFileUploadClick = () => {
    if (BusinessCheckStatus === "success") {
      const confirmed = confirm(
        "이미 사업자 정보가 조회되었습니다. 파일을 첨부하시겠습니까?"
      )
      if (!confirmed) {
        return
      }
    }
    fileInputRef.current?.click()
  }

  // 사업자 정보 심사중일 때
  if (businessInfo && businessInfo?.status === "under_review") {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-lg border border-amber-200 bg-amber-50 p-8">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-amber-200 border-t-amber-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        {/* 메인 메시지 */}
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold text-gray-900">
            사업자 정보 심사중입니다
          </h3>
          <p className="text-sm text-gray-600">
            제출하신 사업자 정보를 검토하고 있습니다.
          </p>
        </div>

        {/* 안내 정보 */}
        <div className="w-full max-w-md space-y-3 rounded-md bg-white p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                심사 소요 시간
              </p>
              <p className="text-sm text-gray-600">
                영업일 기준 1~3일 정도 소요될 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">
                심사 결과 안내
              </p>
              <p className="text-sm text-gray-600">
                심사 완료 시 등록하신 이메일로 결과를 안내드립니다.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          궁금하신 사항이 있으시면 고객센터로 문의해 주세요.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, (errors) => {
        const firstError = Object.values(errors)[0]

        toast.error(firstError?.message || "입력값을 확인해주세요")
      })}
      className="space-y-4"
    >
      <p className="bg-gray-10 px-4 py-2 text-sm text-gray-600">
        결제수단 등록을 위해서 본인인증을 진행해주세요. 아몬드영 인증 서비스를
        통해 안전하게 진행됩니다.
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">사업자 확인</h2>
          <span>사업자 등록 상태를 조회합니다.</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Controller
          name="businessNumber"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="business-number-input">사업자등록번호</Label>
              <Input
                {...field}
                id="business-number-input"
                placeholder="000-00-00000"
                autoComplete="off"
                maxLength={12}
                inputMode="numeric"
              />
            </div>
          )}
        />

        <Controller
          name="ceoName"
          control={form.control}
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="ceo-name-input">대표자 명</Label>
              <Input
                {...field}
                id="ceo-name-input"
                placeholder="대표자명(사업자등록증 표기)"
                autoComplete="off"
              />
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        {BusinessCheckStatus === "success" && (
          <Badge className="bg-green-500 text-white">조회 완료</Badge>
        )}
        {BusinessCheckStatus === "failed" && (
          <Badge className="bg-red-500 text-white">조회 실패</Badge>
        )}

        <Button
          type="button"
          className="ml-auto w-28"
          onClick={handleExternalBusiness}
          disabled={isExternalBusinessPending}
        >
          {isExternalBusinessPending ? "조회 중..." : "조회"}
        </Button>
      </div>

      <div className="rounded-md border p-4">
        {/* 사업자 정보 없음 체크박스와 파일 업로드 UI */}
        <Controller
          name="file"
          control={form.control}
          defaultValue={undefined}
          render={({ field }) => (
            <div className="">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="no-business-info-checkbox"
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleFileUploadClick()
                    } else {
                      field.onChange(undefined)
                    }
                  }}
                  className="mr-2"
                />
                <Label
                  htmlFor="no-business-info-checkbox"
                  className="cursor-pointer text-sm font-medium"
                >
                  사업자 정보가 없어요
                </Label>

                <Button
                  type="button"
                  className="ml-auto w-20 cursor-pointer hover:bg-transparent hover:text-gray-900"
                  variant="outline"
                  onClick={handleFileUploadClick}
                >
                  파일첨부
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]

                  if (file) {
                    // 파일 크기 체크 (예: 10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error("파일 크기는 10MB 이하여야 합니다")
                      return
                    }

                    // 파일 타입 체크
                    const allowedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "application/pdf",
                    ]
                    if (!allowedTypes.includes(file.type)) {
                      toast.error("JPG, PNG, PDF 파일만 업로드 가능합니다")
                      return
                    }

                    field.onChange(file)
                  }
                }}
              />

              {/* 업로드된 파일 정보 표시 */}
              {field.value && (
                <div className="bg-gray-10 mt-2 flex items-center justify-between rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">📎</span>
                    <span className="text-sm font-medium">
                      {field.value.name.length > 20
                        ? field.value.name.slice(0, 20) + "..."
                        : field.value.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(field.value.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      field.onChange(undefined)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="h-6 px-2 text-xs text-red-500"
                  >
                    삭제
                  </Button>
                </div>
              )}
            </div>
          )}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-amber-500"
        disabled={isCreateBusinessPending}
      >
        {isCreateBusinessPending ? (
          <Spinner size="sm" color="white" />
        ) : (
          "다음 단계"
        )}
      </Button>
    </form>
  )
}
