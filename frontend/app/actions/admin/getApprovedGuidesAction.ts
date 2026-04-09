"use server"

import { approvedGuidesService } from "@/services/admin/approved-guides.service"

export async function getApprovedGuidesAction(
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await approvedGuidesService.getApproved(page, limit)
    return response.data
  } catch (error) {
    console.error("Error fetching approved guides:", error)
    throw new Error("Failed to fetch approved guides")
  }
}
