"use server"

import { httpClient } from "@/lib/axios/httpClient"

export async function getPurchases(page: number = 1, limit: number = 10) {
  try {
    const response = await httpClient.get(
      `/members/purchases?page=${page}&limit=${limit}`
    )
    return response
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}
