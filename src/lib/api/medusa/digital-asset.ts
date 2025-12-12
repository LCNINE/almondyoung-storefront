"use server"

import { getAuthHeaders } from "@lib/data/cookies"
import { DigitalAssetsResDto } from "@lib/types/dto/digital-asset.dto"
import { api } from "../api"
import { HttpApiError } from "../api-error"

export const getDigitalAssets = async ({
  skip,
  take,
}: {
  skip: string
  take: string
}): Promise<DigitalAssetsResDto> => {
  const headers = await getAuthHeaders()

  const result = await api<DigitalAssetsResDto>(
    "medusa",
    `/store/library?skip=${skip}&take=${take}`,
    {
      method: "GET",
      withAuth: true,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
    }
  )

  return result
}

export const updateDigitalAssetExerciseApi = async (
  assetId: string
): Promise<void> => {
  const headers = await getAuthHeaders()

  const result = await api<void>(
    "medusa",
    `/store/library/${assetId}/exercise`,
    {
      method: "POST",
      withAuth: true,
      body: { assetId },
      headers: {
        ...headers,
        "Content-Type": "application/json",
        "x-publishable-api-key":
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
    }
  )

  return result
}

export const downloadDigitalAssetApi = async (
  assetId: string
): Promise<{ blob: Blob; filename: string }> => {
  const headers = await getAuthHeaders()

  const baseUrl =
    process.env.USE_RAILWAY_BACKEND === "true"
      ? `${process.env.BACKEND_URL}/medusa`
      : "http://localhost:9000" // 메두사 server PORT

  const response = await fetch(`${baseUrl}/store/library/${assetId}/download`, {
    method: "GET",
    headers: {
      ...headers,
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
    },
  })

  if (!response.ok) {
    throw new HttpApiError(
      `다운로드 실패: ${response.status}`,
      response.status,
      response.statusText
    )
  }

  const blob = await response.blob()

  // content-disposition 헤더에서 파일명 추출
  const contentDisposition = response.headers.get("content-disposition")
  let filename = "download"

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
    )
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, "")
      // URL 인코딩된 한글 파일명 디코딩
      try {
        filename = decodeURIComponent(filename)
      } catch (e) {
        console.warn("Failed to decode filename:", e)
      }
    }
  }

  return { blob, filename }
}
