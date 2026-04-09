"use server"

import commentServices from "@/services/travelGuide/comment.service"

export async function createCommentAction(formData: FormData) {
  try {
    const guideId = formData.get("guideId") as string
    const comment = formData.get("comment") as string
    const parentId = formData.get("parentId") as string | undefined

    if (!guideId || !comment) {
      throw new Error("Invalid input")
    }

    const payload = { guideId, comment, ...(parentId && { parentId }) }

    const response = await commentServices.createComment(payload)

    if (!response.success) {
      throw new Error(response.message)
    }

    // revalidateTag('guide-details')

    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function updateCommentAction(formData: FormData) {
  try {
    const commentId = formData.get("commentId") as string
    const comment = formData.get("comment") as string

    if (!commentId || !comment) {
      throw new Error("Invalid input")
    }

    const response = await commentServices.updateComment(commentId, { comment })

    if (!response.success) {
      throw new Error(response.message)
    }

    // revalidateTag('guide-details')

    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function deleteCommentAction(formData: FormData) {
  try {
    const commentId = formData.get("commentId") as string

    if (!commentId) {
      throw new Error("Invalid input")
    }

    const response = await commentServices.deleteComment(commentId)

    if (!response.success) {
      throw new Error(response.message)
    }

    // revalidateTag('guide-details')

    return {
      success: true,
      message: response.data?.message || "Comment deleted successfully",
    }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
