"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { revalidatePath } from "next/cache"

export async function deleteDraft(guideId: string) {
  const result = await travelGuideServices.deleteDraft(guideId)
  //   revalidatePath("/dashboard/drafts")
  return result
}
