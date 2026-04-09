"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"

export async function getUnderReview(
  page: number = 1,
  limit: number = 10,
  sort?: string,
  search?: string
) {
  const result = await travelGuideServices.getUnderReview(
    page,
    limit,
    sort,
    search
  )

  if (!result.success) {
    throw new Error(result.message || "Failed to fetch under review guides")
  }

  return result.data
}
