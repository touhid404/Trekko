"use server"

import { allGuidesService } from "@/services/admin/all-guides.service"
import { revalidatePath } from "next/cache"

export async function deleteGuideAction(guideId: string) {
  try {
    await allGuidesService.deleteGuide(guideId)
    revalidatePath("/admin/dashboard/guides")
    return { success: true, message: "Guide deleted successfully" }
  } catch (error) {
    console.error("Error deleting guide:", error)
    throw new Error("Failed to delete guide")
  }
}
