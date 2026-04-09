"use server"

import { httpClient } from "@/lib/axios/httpClient"

export async function getGuideDetails(id: string) {
  try {
    const response = await httpClient.get(`/travel-guides/${id}`)
    return response
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
