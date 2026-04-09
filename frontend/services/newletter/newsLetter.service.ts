/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshCookie } from "@/lib/axios/refreshCookie"
import { IResponse } from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface SubscribeNewsletterPayload {
  email: string
}

interface SubscribeNewsletterResponse {
  id: string
  email: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

const newsLetterService = {
  subscribe: async (
    payload: SubscribeNewsletterPayload
  ): Promise<IResponse<SubscribeNewsletterResponse>> => {
    try {
      const cookieHeader = await refreshCookie()

      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || "Failed to subscribe to newsletter",
          data: undefined,
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: data.message || "Successfully subscribed to newsletter",
        data: data.data,
      }
    } catch (error: any) {
      console.error("Error subscribing to newsletter:", error)
      return {
        success: false,
        message: error.message || "Failed to subscribe to newsletter",
        data: undefined,
      }
    }
  },
}

export default newsLetterService
