"use server"

import { axiosInstance } from "@/lib/axios/httpClient"
import { setTokenInCookie } from "@/lib/token"
import { IError, ILoginResponse } from "@/types/auth.types"
import { ILoginPayload, loginSchema } from "@/zod/auth.validation"

import { redirect } from "next/navigation"

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ILoginResponse | IError> => {
  const parsedPayload = loginSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message,
    }
  }

  try {
    const instance = await axiosInstance
    const response = await instance.post<ILoginResponse>(
      "/members/login",
      parsedPayload.data
    )

    const { accessToken, refreshToken, token, user } = response.data.data
    const { email, emailVerified } = user

    await setTokenInCookie({
      accessToken: accessToken,
      refreshToken: refreshToken,
      "better-auth.session_token": token,
    })

    // if (!emailVerified) {
    //   redirect(`/verify-email?email=${email}`)
    // }

    redirect(redirectPath || "/dashboard")

    return {
      success: true,
      data: {
        accessToken,
        refreshToken,
        token,
        user,
      },
    }
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    if (error.response?.data?.data?.error === "Email not verified") {
      redirect(`/verify-email?email=${payload.email}`)
    }

    return {
      success: false,
      message: `Login failed: ${error.response?.data?.message || error.message || "Unknown error"}`,
    }
  }
}
