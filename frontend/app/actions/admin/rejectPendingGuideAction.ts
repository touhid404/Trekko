"use server"

import { pendingGuidesService } from "@/services/admin/pending-guides.service"
import { revalidatePath } from "next/cache"

export async function rejectPendingGuideAction(
  guideId: string,
  feedback: string
) {
  try {
    const response = await pendingGuidesService.rejectGuide(guideId, feedback)
    revalidatePath("/admin/dashboard/pending-guides")
    return {
      success: true,
      message: response.message || "Guide rejected successfully",
    }
  } catch (error) {
    console.error("Error rejecting guide:", error)
    throw new Error("Failed to reject guide")
  }
}
