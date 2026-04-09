"use server"

import paymentService from "@/services/payment.service"
import { IResponse } from "@/types/api.types"

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

export async function initiatePaymentAction(
  formData: FormData
): Promise<IResponse<CreatePaymentSessionResponse>> {
  try {
    const guideId = formData.get("guideId") as string

    if (!guideId) {
      return {
        success: false,
        message: "Guide ID is required",
      }
    }

    const result = await paymentService.createPaymentSession({
      guideId,
    })

    return result
  } catch (error: any) {
    console.error("Error initiating payment:", error)
    return {
      success: false,
      message: error.message || "Failed to initiate payment",
    }
  }
}
