"use server"

import { axiosInstance } from "@/lib/axios/httpClient"
import { redirect } from "next/navigation"

export interface VerifyEmailPayload {
  email: string
  code: string
}

export interface VerifyEmailResponse {
  success: boolean
  message?: string
  data?: {
    user?: {
      id: string
      email: string
      emailVerified: boolean
    }
  }
}

export const verifyEmailAction = async (
  payload: VerifyEmailPayload
): Promise<VerifyEmailResponse> => {
  try {
    if (!payload.email || !payload.code) {
      return {
        success: false,
        message: "Email and code are required",
      }
    }

    if (payload.code.length !== 6) {
      return {
        success: false,
        message: "Verification code must be 6 digits",
      }
    }

    const instance = await axiosInstance
    const response = await instance.post<VerifyEmailResponse>(
      "/members/email-verification",
      {
        email: payload.email,
        otp: payload.code,
      }
    )

    if (response.data.success) {
      redirect("/login")
    }

    return response.data
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

    return {
      success: false,
      message: `Email verification failed: ${
        error.response?.data?.message || error.message || "Unknown error"
      }`,
    }
  }
}
