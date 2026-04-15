import { refreshCookie } from "@/lib/axios/refreshCookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface AdminStatsResponse {
  success: boolean
  message: string
  data: {
    totalUsers: number
    totalGuides: number
    totalCategories: number
    totalPurchases: number
  }
}

export interface MemberStatsResponse {
  success: boolean
  message: string
  data: {
    existGuideCount: number
    existPurchasesCount: number
    existRejectedCount: number
  }
}

export const statsService = {
  async getAdminStats(): Promise<AdminStatsResponse> {
    const url = new URL(`${API_BASE_URL}/admin/stats`)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      next: { tags: ["admin-stats"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch admin stats: ${response.statusText}`)
    }

    return response.json()
  },

  async getMemberStats(): Promise<MemberStatsResponse> {
    const url = new URL(`${API_BASE_URL}/admin/stats`)

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      cache: "no-store", // Ensure we always get fresh data for member stats
      next: { tags: ["member-stats"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch member stats: ${response.statusText}`)
    }

    return response.json()
  },
}
