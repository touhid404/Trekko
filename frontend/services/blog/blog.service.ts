/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshCookie } from "@/lib/axios/refreshCookie"
import { IResponse } from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface BlogAuthor {
  id: string
  name: string
  email?: string
  profilePhoto?: string | null
}

export interface BlogPost {
  id: string
  authorId: string
  title: string
  content: string
  coverImage?: string | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  author: BlogAuthor
  isLikedByMe?: boolean
  _count: {
    likes: number
    comments: number
  }
}

export interface BlogListResponse {
  data: BlogPost[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const blogService = {
  getAll: async (page: number = 1, limit: number = 10): Promise<IResponse<BlogPost[]> & { meta?: any }> => {
    try {
      const cookieHeader = await refreshCookie()

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(
        `${API_BASE_URL}/blogs?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          },
          next: { revalidate: 5, tags: ["blogs"] },
          signal: controller.signal,
        }
      )
      clearTimeout(timeoutId)

      if (!response.ok) {
        return { success: false, message: "Failed to fetch blogs", data: [] }
      }

      const result = await response.json()
      return {
        success: result.success ?? true,
        message: result.message ?? "",
        data: Array.isArray(result.data) ? result.data : [],
        meta: result.meta,
      }
    } catch (error: any) {
      console.error("Error fetching blogs:", error)
      return { success: false, message: "Failed to fetch blogs", data: [] }
    }
  },

  create: async (payload: {
    title: string
    content: string
    coverImage?: string
  }): Promise<IResponse<BlogPost>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create blog post")
    }

    return response.json()
  },

  update: async (
    blogId: string,
    payload: { title?: string; content?: string; coverImage?: string }
  ): Promise<IResponse<BlogPost>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update blog post")
    }

    return response.json()
  },

  delete: async (blogId: string): Promise<IResponse<{ message: string }>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete blog post")
    }

    return response.json()
  },

  getComments: async (blogId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog-comments/${blogId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        return { success: true, data: [] }
      }

      const result = await response.json()
      return {
        success: result.success ?? true,
        data: Array.isArray(result.data) ? result.data : [],
      }
    } catch {
      return { success: true, data: [] }
    }
  },

  deleteComment: async (
    commentId: string
  ): Promise<IResponse<{ message: string }>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blog-comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete comment")
    }

    return response.json()
  },

  updateComment: async (
    commentId: string,
    comment: string
  ): Promise<IResponse<any>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blog-comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({ comment }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update comment")
    }

    return response.json()
  },
}

export default blogService
