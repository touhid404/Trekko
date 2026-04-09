"use server"

import { revalidateTag } from "next/cache"
import {
  categoriesService,
  CreateCategoryData,
} from "@/services/admin/categories.service"

export async function createCategoryAction(data: CreateCategoryData) {
  try {
    const response = await categoriesService.createCategory(data)

    if (response.success) {
      revalidateTag("categories", "/admin/categories")
      return { success: true, message: response.message, data: response.data }
    }

    return { success: false, message: response.message }
  } catch (error) {
    console.error("Error creating category:", error)
    return { success: false, message: "Failed to create category" }
  }
}
