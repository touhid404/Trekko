"use server"
import { cookies } from "next/headers"

export const setCookie = async (
  name: string,
  value: string,
  maxAgeInSeconds: number
) => {
  const cookie = await cookies()
  cookie.set(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: maxAgeInSeconds,
    path: "/",
  })
}

export const getCookie = async (name: string) => {
  const cookie = await cookies()
  return cookie.get(name)?.value
}

export const deleteCookie = async (name: string) => {
  const cookie = await cookies()
  cookie.delete(name)
}
