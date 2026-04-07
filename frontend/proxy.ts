/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtUtils } from "@/lib/jwtUtils"
import { getDefaultDashboardRoute, isAuthRoute } from "@/lib/authUtils"
import { NavSection, UserRole } from "./types/dashboard.navItems.types"
import { getNavItems } from "./lib/navItems"
import { getNewRefreshToken } from "./services/auth.service"
import { tokenExpiredSoon } from "./lib/token"

const refreshTokenMiddleware = async (
  refreshToken: string,
  sessionToken: string
): Promise<boolean> => {
  try {
    const res = await getNewRefreshToken(refreshToken, sessionToken)

    if (!res) {
      return false
    }

    return true
  } catch (error) {
    console.error("Error in refresh token middleware:", error)
    return false
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value
  const sessionToken = request.cookies.get("better-auth.session_token")?.value

  let decoded: any = null
  if (accessToken) {
    const result = jwtUtils.verifyToken(accessToken, process.env.JWT_SECRET!)
    if (result.success) {
      decoded = result.data
    }
  }

  let role: UserRole | null = null

  if (decoded) {
    role = decoded.role
  }

  let routeOwner = null

  if (role === "ADMIN") {
    routeOwner = "ADMIN"
  } else if (role === "MEMBER") {
    routeOwner = "MEMBER"
  }

  // If token is about to expire, try refreshing it before proceeding
  if (
    decoded &&
    refreshToken &&
    (await tokenExpiredSoon(accessToken as string))
  ) {
    const requestHeaders = new Headers(request.headers)

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    // try to refresh token, if it fails, we proceed with the old token and let the route handlers deal with it (they should redirect to login if token is expired)
    try {
      const refreshed = await refreshTokenMiddleware(
        refreshToken,
        sessionToken as string
      )

      if (refreshed) {
        requestHeaders.set("x-token-refreshed", "1")
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
        headers: response.headers,
      })
    } catch (error) {
      console.error("Error refreshing token:", error)
    }

    return response
  }

  if (pathname === "/login" || pathname === "/register") {
    if (sessionToken && decoded) {
      const defaultRoute = getDefaultDashboardRoute(role as UserRole)
      return NextResponse.redirect(new URL(defaultRoute, request.url))
    }
    return NextResponse.next()
  }

  // if (pathname === "/verify-email") {
  //   if (decoded && decoded.emailVerified) {
  //     return NextResponse.next()
  //   } else {
  //     const loginUrl = new URL("/login", request.url)
  //     loginUrl.searchParams.set("redirect", pathname)
  //     return NextResponse.redirect(loginUrl)
  //   }
  // }

  if (decoded && sessionToken && isAuthRoute(pathname)) {
    const defaultRoute = "/dashboard"
    return NextResponse.redirect(new URL(defaultRoute, request.url))
  }

  if (
    !accessToken &&
    !sessionToken &&
    !request.nextUrl.pathname.startsWith("/login")
  ) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // admin parbe sudu tar route gula access korte, member parbe tar route gula access korte, ar guest parbe sudu public route gula access korte
  const navItems: NavSection[] = getNavItems(role as UserRole)

  if (routeOwner) {
    const allowed = navItems.some((section) =>
      section.items.some((item) => item.href === pathname)
    )

    if (!allowed && pathname !== "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/change-password",
    "/my-profile",

    "/login",
    "/register",
  ],
}
