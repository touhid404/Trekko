"use server"

import { redirect } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const googleLoginAction = async (redirectPath?: string) => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not configured")
    }

    const finalRedirectPath = redirectPath || "/dashboard"
    const encodedRedirectPath = encodeURIComponent(finalRedirectPath)

    const googleLoginUrl = `${API_BASE_URL}/members/login/google?redirect=${encodedRedirectPath}`

    redirect(googleLoginUrl)
  } catch (error: any) {
    // Re-throw Next.js redirect errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    console.error("Google login error:", error)
    throw new Error("Failed to initialize Google login")
  }
}
