import { Badge } from "@components/common/ui/badge"
import { Button } from "@components/common/ui/button"
import { Checkbox } from "@components/common/ui/checkbox"
import { Input } from "@components/common/ui/input"
import { Label } from "@components/common/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpApiError } from "@lib/api/api-error"
import { fetchExternalBusinessInfo } from "@lib/api/users/business/client"
import { cn } from "@lib/utils"
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
}: {
  onComplete: (data: {
    verified: boolean
    businessNumber: string
    ceoName: string
    file: File | null
  }) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [BusinessCheckStatus, setBusinessCheckStatus] = useState<
    "success" | "failed" | null
  >(null)

  const [isExternalBusinessPending, startExternalBusinessTransition] =
    useTransition()

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessNumber: "",
      ceoName: "",
    },
  })

  // todo: 파일업로드처리 및 사업자 조회 후 등록처리
  // todo: 조회 버튼 엔터로하면 다음단계 버튼으로 넘어가지는거 방지
  const onSubmit = async (data: BusinessFormData) => {
    if (!BusinessCheckStatus && !form.watch("file")) {
      toast.error("사업자 정보 입력 또는 파일 첨부를 해주세요.")
      return
    }

    // onComplete({
    //   verified: true,
    //   businessNumber: data.businessNumber,
    //   ceoName: data.ceoName,
    //   file: data.file ?? null,
    // })
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

      <Button type="submit" className="w-full bg-amber-500">
        다음 단계
      </Button>
    </form>
  )
}
