"use server"

import { approvedGuidesService } from "@/services/admin/approved-guides.service"
import { revalidatePath } from "next/cache"

export async function rejectGuideAction(guideId: string, feedback: string) {
  try {
    const response = await approvedGuidesService.rejectGuide(guideId, feedback)
    revalidatePath("/admin/dashboard/approved-guides")
    return {
      success: true,
      message: response.message || "Guide rejected successfully",
    }
  } catch (error) {
    console.error("Error rejecting guide:", error)
    throw new Error("Failed to reject guide")
  }
}
