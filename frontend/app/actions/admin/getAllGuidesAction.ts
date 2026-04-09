"use server"

import { allGuidesService } from "@/services/admin/all-guides.service"

export async function getAllGuidesAction(
  page: number = 1,
  limit: number = 12,
  sort?: string,
  search?: string,
  filter?: Record<string, string>
) {
  try {
    const response = await allGuidesService.getAll(
      page,
      limit,
      sort,
      search,
      filter
    )
    return response.data
  } catch (error) {
    console.error("Error fetching all guides:", error)
    throw new Error("Failed to fetch guides")
  }
}
