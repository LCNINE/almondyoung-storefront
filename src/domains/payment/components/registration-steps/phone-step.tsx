"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@components/common/ui/button"
import { Input } from "@components/common/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/common/ui/select"

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  residentNumberFront: z.string().min(1, "주민번호 앞자리를 입력해주세요"),
  residentNumberBack: z.string().min(1, "주민번호 뒷자리를 입력해주세요"),
  phoneNumber: z
    .string()
    .regex(/^\d{10,11}$/, "올바른 전화번호를 입력해주세요"),
  carrier: z.string().min(1, "통신사를 선택해주세요"),
  verificationCode: z.string().length(6, "인증번호 6자리를 입력해주세요"),
})

type FormData = z.infer<typeof schema>

// 휴대폰 인증 스텝 컴포넌트
export function PhoneStep({
  onComplete,
}: {
  onComplete: (data: { verified: boolean; phoneNumber: string }) => void
}) {
  const [codeSent, setCodeSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleSendCode = async () => {
    // 인증번호 발송 API
    setCodeSent(true)
  }

  const onSubmit = async (data: FormData) => {
    // 인증 확인 API
    onComplete({ verified: true, phoneNumber: data.phoneNumber })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-600">
        결제수단 등록을 위해서 본인인증을 진행해주세요. 아몬드영 인증 서비스를
        통해 안전하게 진행됩니다.
      </p>

      <div className="space-y-3">
        <Input placeholder="이름" {...register("name")} />

        <div className="flex items-center gap-2">
          <Input
            placeholder="주민번호 앞자리"
            {...register("residentNumberFront")}
          />
          <span>-</span>{" "}
          <Input
            className="placeholder:tracking-wide"
            placeholder="0******"
            {...register("residentNumberBack")}
            maxLength={1}
          />
        </div>

        <div className="flex gap-2">
          <Input placeholder="전화번호(숫자만)" {...register("phoneNumber")} />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="통신사" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skt">SKT</SelectItem>
              <SelectItem value="kt">KT</SelectItem>
              <SelectItem value="lgu">LG U+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {codeSent && (
          <Input
            placeholder="인증번호 6자리"
            {...register("verificationCode")}
          />
        )}
      </div>

      {!codeSent ? (
        <Button
          type="button"
          onClick={handleSendCode}
          className="w-full bg-amber-500"
        >
          인증 요청
        </Button>
      ) : (
        <Button type="submit" className="w-full bg-amber-500">
          다음 단계
        </Button>
      )}
    </form>
  )
}
