"use server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { setCookie } from "./cookies"

const JWT_ACCESS_TOKEN = process.env.JWT_SECRET as string

const getTokenRemainingTime = (token: string): number => {
  if (!token) return 0

  try {
    const payload = jwt.decode(token) as JwtPayload

    if (payload && !payload.exp) {
      return 0
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const remainingTime = (payload.exp as number) - currentTime

    return remainingTime > 0 ? remainingTime : 0
  } catch (error) {
    console.error("Error decoding token:", error)
    return 0
  }
}

export interface ITokenPayload {
  token: {
    name: string
    token: string
  }[]
}

export const setTokenInCookie = async (
  tokens: Record<string, string>,
  fallbackMaxAge: number = 60 * 60 * 24
) => {
  for (const [name, token] of Object.entries(tokens)) {
    let maxAgeInSeconds: number | undefined = undefined

    if (name !== "better-auth.session_token") {
      maxAgeInSeconds = getTokenRemainingTime(token)
    }
    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAge)
  }
}

export const tokenExpiredSoon = async (
  token: string,
  thresholdInSeconds: number = 300
): Promise<boolean> => {
  const remainingTime = getTokenRemainingTime(token)
  return Promise.resolve(
    remainingTime > 0 && remainingTime <= thresholdInSeconds
  )
}

export const isTokenExpired = async (token: string): Promise<boolean> => {
  const remainingTime = getTokenRemainingTime(token)
  return Promise.resolve(remainingTime === 0)
}
