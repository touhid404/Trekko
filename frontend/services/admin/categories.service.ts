import { refreshCookie } from "@/lib/axios/refreshCookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface CategoryGuide {
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
  guides: CategoryGuide[]
}

export interface CategoriesResponse {
  success: boolean
  message: string
  data: {
    data: Category[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface CreateCategoryData {
  slug: string
  title: string
  description?: string
}

export interface UpdateCategoryData {
  slug?: string
  title?: string
  description?: string
}

export const categoriesService = {
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<CategoriesResponse> {
    const url = new URL(`${API_BASE_URL}/categories`)

    url.searchParams.append("page", String(page))
    url.searchParams.append("limit", String(limit))

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

      next: { revalidate: 10, tags: ["categories"] },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }

    return response.json()
  },

  async createCategory(
    data: CreateCategoryData
  ): Promise<{ success: boolean; message: string; data: Category }> {
    const url = new URL(`${API_BASE_URL}/categories`)

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`)
    }

    return response.json()
  },

  async updateCategory(
    categoryId: string,
    data: UpdateCategoryData
  ): Promise<{ success: boolean; message: string; data: Category }> {
    const url = new URL(`${API_BASE_URL}/categories/${categoryId}`)

    const response = await fetch(url.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`)
    }

    return response.json()
  },

  async deleteCategory(
    categoryId: string
  ): Promise<{ success: boolean; message: string }> {
    const url = new URL(`${API_BASE_URL}/categories/${categoryId}`)

    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`)
    }

    return response.json()
  },
}
