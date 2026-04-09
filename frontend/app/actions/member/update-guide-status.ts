"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { DraftGuide } from "@/app/actions/member/get-drafts"
import { revalidateTag } from "next/cache"

export async function submitGuideForReview(
  guideId: string
): Promise<DraftGuide> {
  const result = await travelGuideServices.updateStatus(guideId)
  revalidateTag("draft-guides", "page")
  return result
}
