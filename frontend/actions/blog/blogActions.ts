/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidateTag } from "next/cache"
import blogService from "@/services/blog/blog.service"
import { refreshCookie } from "@/lib/axios/refreshCookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function createBlogAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const coverImage = formData.get("coverImage") as string | undefined

    if (!title || !content) {
      throw new Error("Title and content are required")
    }

    const payload: { title: string; content: string; coverImage?: string } = {
      title,
      content,
    }

    if (coverImage) {
      payload.coverImage = coverImage
    }

    const response = await blogService.create(payload)

    if (!response.success) {
      throw new Error(response.message)
    }

    revalidateTag("blogs", "max")
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateBlogAction(blogId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const coverImage = formData.get("coverImage") as string | undefined

    const payload: { title?: string; content?: string; coverImage?: string } = {}
    if (title) payload.title = title
    if (content) payload.content = content
    if (coverImage !== undefined) payload.coverImage = coverImage

    const response = await blogService.update(blogId, payload)

    if (!response.success) {
      throw new Error(response.message)
    }

    revalidateTag("blogs", "max")
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function deleteBlogAction(blogId: string) {
  try {
    const response = await blogService.delete(blogId)

    if (!response.success) {
      throw new Error(response.message)
    }

    revalidateTag("blogs", "max")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function createBlogCommentAction(formData: FormData) {
  try {
    const blogId = formData.get("blogId") as string
    const comment = formData.get("comment") as string
    const parentId = formData.get("parentId") as string | undefined

    if (!blogId || !comment) {
      throw new Error("Invalid input")
    }

    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blog-comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify({
        blogId,
        comment,
        ...(parentId && { parentId }),
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || "Failed to post comment")
    }

    const result = await response.json()
    revalidateTag("blogs", "max")
    return { success: true, data: result.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function toggleBlogLikeAction(blogId: string) {
  try {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/blog-likes/${blogId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || "Failed to toggle like")
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateBlogCommentAction(commentId: string, comment: string) {
  try {
    const response = await blogService.updateComment(commentId, comment)

    if (!response.success) {
      throw new Error(response.message)
    }

    revalidateTag("blogs", "max")
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function deleteBlogCommentAction(commentId: string) {
  try {
    const response = await blogService.deleteComment(commentId)

    if (!response.success) {
      throw new Error(response.message)
    }

    revalidateTag("blogs", "max")
    return { success: true }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
