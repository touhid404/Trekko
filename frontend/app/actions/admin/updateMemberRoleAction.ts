"use server"

import { membersService } from "@/services/admin/members.service"
import { revalidatePath } from "next/cache"

export async function updateMemberRoleAction(formData: FormData) {
  try {
    const memberId = formData.get("memberId") as string
    const role = formData.get("role") as "ADMIN" | "MEMBER"

    if (!memberId || !role) {
      throw new Error("Member ID and role are required")
    }

    const response = await membersService.updateRole(memberId, role)

    // Revalidate the members page
    revalidatePath("/admin/dashboard/members")

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error updating member role:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
