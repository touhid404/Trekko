"use server"

import { rejectedGuidesService } from "@/services/admin/rejected-guides.service"

export async function getRejectedGuidesAction(
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await rejectedGuidesService.getRejected(page, limit)
    return response.data
  } catch (error) {
    console.error("Error fetching rejected guides:", error)
    throw new Error("Failed to fetch rejected guides")
  }
}
