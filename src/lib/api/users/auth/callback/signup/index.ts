"use server"

import { api } from "@lib/api/api"
import { medusaSignin } from "@lib/api/medusa/signin"
import { medusaSignup } from "@lib/api/medusa/signup"
import { setTokenCookies } from "@lib/data/cookies"
import { UserDetailDto } from "@lib/types/dto/users"
import { redirect } from "next/navigation"

export const signupCallback = async (userId: string, redirectTo?: string) => {
  const targetPath = redirectTo || "/"

  try {
    const { accessToken, refreshToken } = await api<{
      accessToken: string
      refreshToken: string
    }>("users", "/auth/callback/signup", {
      method: "POST",
      body: { userId },
      withAuth: false,
    })

    await setTokenCookies(accessToken, refreshToken)

    // 메두사 로그인 처리
    const medusaSigninResponse = await medusaSignin()

    // 이미 메두사 회원인 경우 리다이렉트
    if (medusaSigninResponse.success) {
      redirect(targetPath)
    }

    const currentUser = await api<UserDetailDto>("users", `/users/${userId}`, {
      method: "GET",
      withAuth: true,
    })

    if (currentUser) {
      // 메두사 회원 가입 처리
      const result = await medusaSignup({
        email: currentUser.email,
        first_name: currentUser.username,
        last_name: currentUser.username,
        almond_user_id: currentUser.id,
        almond_login_id: currentUser.loginId,
      })

      if (!result.success) {
        return redirect("/login?error=signup_failed")
      }
    }

    // 메두사 회원 로그인 처리
    await medusaSignin()

    return redirect(targetPath)
  } catch (error) {
    console.error("Signup callback error:", error)
    return redirect("/login?error=callback_failed")
  }
}
