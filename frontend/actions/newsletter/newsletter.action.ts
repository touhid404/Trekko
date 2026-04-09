"use server"

import newsLetterService from "@/services/newletter/newsLetter.service"
import { IResponse } from "@/types/api.types"

interface SubscribeNewsletterResponse {
  id: string
  email: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export async function subscribeNewsletterAction(
  email: string
): Promise<IResponse<SubscribeNewsletterResponse>> {
  try {
    if (!email || !email.includes("@")) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    const result = await newsLetterService.subscribe({
      email,
    })

    return result
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error)
    return {
      success: false,
      message: error.message || "Failed to subscribe to newsletter",
    }
  }
}
