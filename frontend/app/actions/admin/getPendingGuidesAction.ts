"use server"

import { pendingGuidesService } from "@/services/admin/pending-guides.service"

export async function getPendingGuidesAction(
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await pendingGuidesService.getUnderReview(page, limit)
    return response.data
  } catch (error) {
    console.error("Error fetching pending guides:", error)
    throw new Error("Failed to fetch pending guides")
  }
}
