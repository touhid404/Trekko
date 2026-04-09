"use server"

import { membersService } from "@/services/admin/members.service"
import { revalidatePath } from "next/cache"

export async function updateMemberStatusAction(formData: FormData) {
  try {
    const memberId = formData.get("memberId") as string
    const status = formData.get("status") as "ACTIVE" | "INACTIVE"

    if (!memberId || !status) {
      throw new Error("Member ID and status are required")
    }

    const response = await membersService.updateStatus(memberId, status)

    // Revalidate the members page
    revalidatePath("/admin/dashboard/members")

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error updating member status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
