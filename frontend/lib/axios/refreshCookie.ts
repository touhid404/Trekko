"use server"

import { cookies } from "next/headers"

export async function refreshCookie(): Promise<string> {
  try {
    const cookieStore = await cookies()
    const allCookies: string[] = []

    cookieStore.getAll().forEach((cookie) => {
      allCookies.push(`${cookie.name}=${cookie.value}`)
    })

    return allCookies.join("; ")
  } catch (error) {
    console.error("Error refreshing cookies:", error)
    return ""
  }
}
