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

export interface ApprovedGuide {
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

export interface ApprovedGuidesResponse {
  success: boolean
  message: string
  data: {
    data: ApprovedGuide[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export const approvedGuidesService = {
  async getApproved(
    page: number = 1,
    limit: number = 10
  ): Promise<ApprovedGuidesResponse> {
    const url = new URL(`${API_BASE_URL}/admin/approved-guides`)

    url.searchParams.append("page", String(page))
    url.searchParams.append("limit", String(limit))

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      next: { tags: ["approved-guides"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch approved guides: ${response.statusText}`)
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
