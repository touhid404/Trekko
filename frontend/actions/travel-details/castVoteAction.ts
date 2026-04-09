"use server"

import { revalidateTag } from "next/cache"
import voteServices from "@/services/travelGuide/vote.service"

export async function castVoteAction(formData: FormData) {
  try {
    const guideId = formData.get("guideId") as string
    const voteType = formData.get("voteType") as "UP" | "DOWN"

    if (!guideId || !voteType) {
      throw new Error("Invalid input")
    }

    const response = await voteServices.castVote({ guideId, voteType })

    if (!response.success) {
      throw new Error(response.message)
    }

    // Revalidate the page or specific tag
    // revalidateTag('guide-details')

    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
