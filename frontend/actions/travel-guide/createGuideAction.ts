"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { IResponse } from "@/types/api.types"

interface DraftGuide {
  id: string
  memberId: string
  categoryId: string
  title: string
  description: string
  itinerary: string
  status: string
  isPaid: boolean
  price: number
  coverImage: string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

interface CreateGuidePayload {
  title: string
  description: string
  categoryId: string
  destination?: string
  itinerary?: any[]
  status?: string
  isPaid?: boolean
  price?: number
  coverImage?: string
  images?: string[]
}

export async function createGuideAction(
  payload: CreateGuidePayload
): Promise<IResponse<DraftGuide>> {
  try {
    if (!payload.title || !payload.description || !payload.categoryId) {
      return {
        success: false,
        message: "Missing required fields: title, description, categoryId",
      }
    }

  

    const result = await travelGuideServices.createGuide(payload)

    return {
      success: true,
      message: "Travel guide created successfully",
      data: result,
    }
  } catch (error: any) {
    console.error("Error creating guide:", error)
    return {
      success: false,
      message: error.message || "Failed to create travel guide",
    }
  }
}
