/* eslint-disable @typescript-eslint/no-explicit-any */
import { refreshCookie } from "@/lib/axios/refreshCookie"
import { IResponse } from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Member {
  id: string
  name: string
  email: string
  // Add other fields as needed
}

interface Comment {
  id: string
  guideId: string
  memberId: string
  parentId: string | null
  comment: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  member: Member
  replies?: Comment[]
}

interface CreateCommentPayload {
  guideId: string
  comment: string
  parentId?: string
}

interface UpdateCommentPayload {
  comment: string
}

const commentServices = {
  createComment: async (
    payload: CreateCommentPayload
  ): Promise<IResponse<Comment>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`)
    }

    return response.json()
  },

  getComments: async (guideId: string): Promise<IResponse<Comment[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${guideId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Handle 404 or other errors gracefully
      if (!response.ok) {
        return {
          success: true,
          message: "No comments yet",
          data: [],
        }
      }

      const result = await response.json()
      return {
        success: result.success ?? true,
        message: result.message ?? "Comments retrieved",
        data: Array.isArray(result.data) ? result.data : [],
      }
    } catch (error: any) {
      console.error("Error fetching comments:", error)
      // Return empty array on error instead of throwing
      return {
        success: true,
        message: "Comments unavailable",
        data: [],
      }
    }
  },

  updateComment: async (
    commentId: string,
    payload: UpdateCommentPayload
  ): Promise<IResponse<Comment>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to update comment: ${response.statusText}`)
    }

    return response.json()
  },

  deleteComment: async (
    commentId: string
  ): Promise<IResponse<{ message: string }>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to delete comment: ${response.statusText}`)
    }

    return response.json()
  },
}

export default commentServices
