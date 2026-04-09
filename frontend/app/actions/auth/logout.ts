"use server"

import { axiosInstance } from "@/lib/axios/httpClient"
import { deleteCookie } from "@/lib/cookies"
import { redirect } from "next/navigation"

export interface ILogoutResponse {
  success: boolean
  message?: string
}

export const logoutAction = async (): Promise<ILogoutResponse> => {
  try {
    const instance = await axiosInstance
    const response = await instance.post<ILogoutResponse>("/members/logout")

    // Always clear cookies on logout (client has no session anymore)
    await deleteCookie("accessToken")
    await deleteCookie("refreshToken")
    await deleteCookie("better-auth.session_token")

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

    // make sure cookies are cleaned even on failure
    await deleteCookie("accessToken")
    await deleteCookie("refreshToken")
    await deleteCookie("better-auth.session_token")

    return {
      success: false,
      message: `Logout failed: ${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`,
    }
  }
}
export const logoutActionForNavber = async (): Promise<ILogoutResponse> => {
  try {
    const instance = await axiosInstance
    const response = await instance.post<ILogoutResponse>("/members/logout")

    // Always clear cookies on logout (client has no session anymore)
    await deleteCookie("accessToken")
    await deleteCookie("refreshToken")
    await deleteCookie("better-auth.session_token")

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

    // make sure cookies are cleaned even on failure
    await deleteCookie("accessToken")
    await deleteCookie("refreshToken")
    await deleteCookie("better-auth.session_token")

    return {
      success: false,
      message: `Logout failed: ${
        error?.response?.data?.message || error?.message || "Unknown error"
      }`,
    }
  }
}
