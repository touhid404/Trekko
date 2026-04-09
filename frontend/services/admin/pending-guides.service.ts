import { refreshCookie } from "@/lib/axios/refreshCookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface GuideMedia {
  id: string
  guideId: string
  type: string
  url: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  slug: string
  title: string
  description: string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PendingGuide {
  id: string
  memberId: string
  categoryId: string
  title: string
  description: string
  itinerary: string
  status: string
  isPaid: boolean
  price: number
  coverImage: string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  guideMedia: GuideMedia[]
  votes: any[]
  comments: any[]
  category: Category
}

export interface PendingGuidesResponse {
  success: boolean
  message: string
  data: {
    data: PendingGuide[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export const pendingGuidesService = {
  async getUnderReview(
    page: number = 1,
    limit: number = 10
  ): Promise<PendingGuidesResponse> {
    const url = new URL(`${API_BASE_URL}/admin/under-review-guides`)

    url.searchParams.append("page", String(page))
    url.searchParams.append("limit", String(limit))

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      next: { tags: ["pending-guides"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch pending guides: ${response.statusText}`)
    }

    return response.json()
  },

  async approveGuide(
    guideId: string
  ): Promise<{ success: boolean; message: string; data: any }> {
    const url = new URL(`${API_BASE_URL}/admin/update-guide-status/${guideId}`)

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      body: JSON.stringify({ status: "APPROVED" }),
    })

    if (!response.ok) {
      throw new Error(`Failed to approve guide: ${response.statusText}`)
    }

    return response.json()
  },

  async rejectGuide(
    guideId: string,
    feedback: string
  ): Promise<{ success: boolean; message: string; data: any }> {
    const url = new URL(`${API_BASE_URL}/admin/rejected-guides/${guideId}`)

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      body: JSON.stringify({ feedback }),
    })

    if (!response.ok) {
      throw new Error(`Failed to reject guide: ${response.statusText}`)
    }

    return response.json()
  },
}
