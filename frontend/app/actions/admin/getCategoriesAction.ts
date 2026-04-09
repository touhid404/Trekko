"use server"

import { revalidateTag } from "next/cache"
import { categoriesService } from "@/services/admin/categories.service"

export async function getCategoriesAction(
  page: number = 1,
  limit: number = 10
) {
  try {
    const response = await categoriesService.getAll(page, limit)
    return response
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw new Error("Failed to fetch categories")
  }
}
