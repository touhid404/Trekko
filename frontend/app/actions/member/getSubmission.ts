"use server"

import { revalidateTag } from "next/cache"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"

export async function getSubmission(
  page: number = 1,
  limit: number = 10,
  sort?: string,
  search?: string
) {
  try {
    const result = await travelGuideServices.getSubmission(
      page,
      limit,
      sort,
      search
    )

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch approved guides")
    }

    return result.data
  } catch (error: any) {
    console.error("Failed to get approved guides:", error)
    throw error
  }
}
