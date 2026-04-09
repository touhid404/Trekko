"use server"

import { httpClient } from "@/lib/axios/httpClient"

export async function getRejectedGuides(page: number = 1, limit: number = 10) {
  try {
    const response = await httpClient.get(
      `/members/rejected-guides?page=${page}&limit=${limit}`
    )
    return response
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
