"use server"

import { setTokenInCookie } from "@/lib/token"
import { cookies } from "next/headers"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables")
}

export const getNewRefreshToken = async (
  refreshToken: string,
  session: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/members/getNewRefreshToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: `refreshToken=${refreshToken}; better-auth.session-token=${session}`,
      },
    })

    const payload = await response.json()

    // some endpoints use "success" but spelling may vary; guard safely
    const data = payload?.data ?? payload
    if (!data || (!data.success && !data.seccess)) {
      console.warn(
        "refresh-token response did not contain success flag",
        payload
      )
      return false
    }
    const { accessToken, refreshToken: newRefreshToken, token } = data

    await setTokenInCookie({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
      "better-auth.session_token": token,
    })
    return true
  } catch (error) {
    console.error("Error fetching new refresh token:", error)
    return false
  }
}
import { cache } from "react"

export const getUserInfo = cache(async () => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")?.value
  const session = cookieStore.get("better-auth.session_token")?.value

  if (!accessToken || !session) {
    return null
  }

  try {
    const response = await fetch(`${BASE_URL}/members/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken}; better-auth.session_token=${session}`,
      },
    })

    const responseData = await response.json()

    if (!responseData || !responseData.success) {
      console.warn("/members/me response missing success", responseData)
      return null
    }

    // API returns either {data: user} or {data: {user}}
    const fetchedData = responseData.data

    if (!fetchedData) {
      return null
    }

    if (fetchedData.user) {
      return fetchedData.user
    }

    return fetchedData
  } catch (error) {
    console.error("Error fetching user info:", error)
    return null
  }
})

export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string } | null> => {
  try {
    const cookieStore = await cookies()

    const accessToken = cookieStore.get("accessToken")?.value
    const session = cookieStore.get("better-auth.session_token")?.value

    if (!accessToken || !session) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    const response = await fetch(`${BASE_URL}/members/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        cookie: `accessToken=${accessToken}; better-auth.session_token=${session}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })

    const data = await response.json()
    return {
      success: data?.success ?? false,
      message: data?.message,
    }
  } catch (error) {
    console.error("Error changing password:", error)
    return {
      success: false,
      message: "Error changing password",
    }
  }
}
