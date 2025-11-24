"use server"

import { getCookies } from "@lib/data/cookies"
import { UserDetail } from "domains/auth/types"
import { cache } from "react"
import { USER_SERVICE_BASE_URL } from "../api.config"
import { serverApi } from "../server-api"

export const fetchCurrentUser = cache(async (): Promise<UserDetail | null> => {
  try {
    return await serverApi(USER_SERVICE_BASE_URL + "/users/detail", {
      cache: "no-store",
    })
  } catch (error) {
    throw error
  }
})

export const fetchMe = cache(async (): Promise<UserDetail> => {
  const cookieString = await getCookies()

  const response = await fetch(`${process.env.APP_URL}/api/users/detail`, {
    cache: "no-store",
    headers: {
      Cookie: cookieString,
    },
  })

  // 라우트 핸들러에서 401 에러를 반환하면 error.tsx로 전파
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || `Failed to fetch me: ${response.status}`)
  }

  const data = await response.json()
  return data.data
})
