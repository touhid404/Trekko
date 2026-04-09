"use server"

import { revalidateTag } from "next/cache"
import {
  categoriesService,
  UpdateCategoryData,
} from "@/services/admin/categories.service"

export async function updateCategoryAction(
  categoryId: string,
  data: UpdateCategoryData
) {
  try {
    const response = await categoriesService.updateCategory(categoryId, data)

    if (response.success) {
      revalidateTag("categories", "/admin/categories")
      return { success: true, message: response.message, data: response.data }
    } else {
      return { success: false, message: response.message }
    }
  } catch (error) {
    console.error("Error updating category:", error)
    return { success: false, message: "Failed to update category" }
  }
}
