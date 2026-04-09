"use server"

import { revalidateTag } from "next/cache"
import { categoriesService } from "@/services/admin/categories.service"

export async function deleteCategoryAction(categoryId: string) {
  try {
    const response = await categoriesService.deleteCategory(categoryId)

    if (response.success) {
      revalidateTag("categories", "/admin/categories")
      return { success: true, message: response.message }
    } else {
      return { success: false, message: response.message }
    }
  } catch (error) {
    console.error("Error deleting category:", error)
    return { success: false, message: "Failed to delete category" }
  }
}
