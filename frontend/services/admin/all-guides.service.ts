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

export interface Guide {
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

export interface AllGuidesResponse {
  success: boolean
  message: string
  data: {
    data: Guide[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface DeleteGuideResponse {
  success: boolean
  message: string
}

export const allGuidesService = {
  async getAll(
    page: number = 1,
    limit: number = 12,
    sort?: string,
    search?: string,
    filter?: Record<string, string>
  ): Promise<AllGuidesResponse> {
    const url = new URL(`${API_BASE_URL}/admin/all-guides`)

    url.searchParams.append("page", String(page))
    url.searchParams.append("limit", String(limit))

    if (sort) {
      if (sort.startsWith("-")) {
        url.searchParams.append("sortBy", sort.substring(1))
        url.searchParams.append("sortOrder", "desc")
      } else {
        url.searchParams.append("sortBy", sort)
        url.searchParams.append("sortOrder", "asc")
      }
    }

    if (search) {
      url.searchParams.append("searchTerm", search)
    }

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value)
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      // next: { revalidate: 30, tags: ["all-guides"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch guides: ${response.statusText}`)
    }

    return response.json()
  },

  async deleteGuide(guideId: string): Promise<DeleteGuideResponse> {
    const url = new URL(`${API_BASE_URL}/admin/guides/${guideId}`)

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete guide: ${response.statusText}`)
    }

    return response.json()
  },
}
