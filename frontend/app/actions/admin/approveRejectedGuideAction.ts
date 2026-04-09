"use server"

import { rejectedGuidesService } from "@/services/admin/rejected-guides.service"
import { revalidatePath } from "next/cache"

export async function approveRejectedGuideAction(guideId: string) {
  try {
    const response = await rejectedGuidesService.approveGuide(guideId)
    revalidatePath("/admin/dashboard/rejected-guides")
    return {
      success: true,
      message: response.message || "Guide approved successfully",
    }
  } catch (error) {
    console.error("Error approving guide:", error)
    throw new Error("Failed to approve guide")
  }
}
