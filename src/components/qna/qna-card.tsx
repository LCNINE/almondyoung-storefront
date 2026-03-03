"use client"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import type { QuestionResponseDto } from "@/lib/types/dto/ugc"

type Props = {
  question: QuestionResponseDto
  isExpanded: boolean
  onToggle: () => void
}

function maskUserId(userId: string): string {
  if (userId.length <= 4) return userId + "****"
  return userId.slice(0, userId.length - 4) + "****"
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${month}.${day}`
}

export function QnaCard({ question, isExpanded, onToggle }: Props) {
  const isAnswered = question.status === "answered"

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button type="button" className="w-full cursor-pointer py-6 text-left">
          <div className="space-y-2">
            <Badge
              variant={isAnswered ? "default" : "secondary"}
              className={
                isAnswered
                  ? "bg-gray-900 text-white hover:bg-gray-900"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-100"
              }
            >
              {isAnswered ? "답변완료" : "답변대기"}
            </Badge>
            <p className="text-[15px] leading-relaxed text-gray-900">
              {question.title}
            </p>
            <p className="text-xs text-gray-400">
              {maskUserId(question.userId)}
              <span className="mx-1.5">|</span>
              {formatDate(question.createdAt)}
            </p>
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {question.answer ? (
          <div className="bg-gray-10 px-5 py-6">
            <p className="mb-4 text-base font-bold text-gray-900">답변</p>
            <p className="text-[14px] leading-relaxed whitespace-pre-line text-gray-700">
              {question.answer.content}
            </p>
            <p className="mt-4 text-xs text-gray-400">
              {formatDate(question.answer.createdAt)}
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 px-5 py-6">
            <p className="text-sm text-gray-500">
              아직 답변이 등록되지 않았습니다.
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
