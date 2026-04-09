"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { DraftGuide } from "@/app/actions/member/get-drafts"

export interface UpdateDraftPayload {
  title?: string
  destination?: string
  description?: string
  categoryId?: string
  itinerary?: any
  status?: string
  isPaid?: boolean
  price?: number
  coverImage?: string
}

export async function updateDraft(
  guideId: string,
  payload: UpdateDraftPayload
): Promise<DraftGuide> {
  return await travelGuideServices.updateGuide(guideId, payload)
}
