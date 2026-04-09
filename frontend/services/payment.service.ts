/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshCookie } from "@/lib/axios/refreshCookie"
import { IResponse } from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface CreatePaymentSessionPayload {
  guideId: string
}

interface CreatePaymentSessionResponse {
  purchase: {
    id: string
    memberId: string
    guideId: string
    amount: number
    paymentStatus: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
  }
  checkoutUrl: string
  sessionId: string
}

const paymentService = {
  createPaymentSession: async (
    payload: CreatePaymentSessionPayload
  ): Promise<IResponse<CreatePaymentSessionResponse>> => {
    try {
      const cookieHeader = await refreshCookie()

      const response = await fetch(`${API_BASE_URL}/payments/create-session`, {
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
          message: errorData.message || "Failed to create payment session",
          data: undefined,
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: data.message || "Payment session created",
        data: data.data,
      }
    } catch (error: any) {
      console.error("Error creating payment session:", error)
      return {
        success: false,
        message: error.message || "Failed to create payment session",
        data: undefined,
      }
    }
  },
}

export default paymentService
