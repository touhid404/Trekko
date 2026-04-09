"use server"

import { axiosInstance } from "@/lib/axios/httpClient"
import { setTokenInCookie } from "@/lib/token"
import { IError, IRegisterResponse } from "@/types/auth.types"
import { IRegisterPayload, registerSchema } from "@/zod/auth.validation"

import { redirect } from "next/navigation"

export const registerAction = async (
  payload: Omit<IRegisterPayload, "confirmPassword">
): Promise<IRegisterResponse | IError> => {
  const fullPayload = {
    ...payload,
    confirmPassword: payload.password,
  }

  const parsedPayload = registerSchema.safeParse(fullPayload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message,
    }
  }

  try {
    const instance = await axiosInstance
    const response = await instance.post<IRegisterResponse>("/members/signup", {
      name: parsedPayload.data.name,
      email: parsedPayload.data.email,
      password: parsedPayload.data.password,
    })

    const { accessToken, refreshToken, token, user } = response.data.data
    // const { email, emailVerified } = user

    await setTokenInCookie({
      accessToken: accessToken,
      refreshToken: refreshToken,
      "better-auth.session_token": token,
    })

    // if (!emailVerified) {
    //   redirect(`/verify-email?email=${email}`)
    // }

    redirect("/login")
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

    if (error.response?.data?.data?.error === "Email already exists") {
      return {
        success: false,
        message: "Email already registered. Please login instead.",
      }
    }

    return {
      success: false,
      message: `Registration failed: ${error.response?.data?.message || error.message || "Unknown error"}`,
    }
  }
}
