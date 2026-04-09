"use server"

import { pendingGuidesService } from "@/services/admin/pending-guides.service"
import { revalidatePath } from "next/cache"

export async function approvePendingGuideAction(guideId: string) {
  try {
    const response = await pendingGuidesService.approveGuide(guideId)
    revalidatePath("/admin/dashboard/pending-guides")
    return {
      success: true,
      message: response.message || "Guide approved successfully",
    }
  } catch (error) {
    console.error("Error approving guide:", error)
    throw new Error("Failed to approve guide")
  }
}
