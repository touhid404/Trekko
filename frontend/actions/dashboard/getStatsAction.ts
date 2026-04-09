/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { statsService } from "@/services/dashboard/stats.service"
import { getUserInfo } from "@/services/auth.service"

interface StatsData {
  totalUsers?: number
  totalGuides?: number
  totalCategories?: number
  totalPurchases?: number
  existGuideCount?: number
  existPurchasesCount?: number
  existRejectedCount?: number
}

export async function getStats(): Promise<{
  success: boolean
  message?: string
  data?: StatsData
}> {
  try {
    const user = await getUserInfo()

    if (!user) {
      return { success: false, message: "User not authenticated" }
    }

    let response
    if (user.role === "ADMIN") {
      response = await statsService.getAdminStats()
    } else if (user.role === "MEMBER") {
      response = await statsService.getMemberStats()
    } else {
      return { success: false, message: "Invalid user role" }
    }

    if (!response.success) {
      return { success: false, message: response.message }
    }

    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
