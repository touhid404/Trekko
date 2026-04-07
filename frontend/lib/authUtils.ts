export type UserRole = "ADMIN" | "MEMBER" | "GUEST"

export const authRoutes = ["/login", "/register", "/verify-email"]

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((router: string) => router === pathname)
}

// export type routeConfig = {
//   exact: string[]
//   pattern: RegExp[]
// }

// export const commonProtectedRoutes: routeConfig = {
//   exact: ["/change-password", "/my-profile"],
//   pattern: [],
// }

// export const adminProtectedRoutes: routeConfig = {
//   pattern: [/^\/dashboard/],
//   exact: [],
// }

// export const memberProtectedRoutes: routeConfig = {
//   pattern: [/^\/dashboard/],
//   exact: [],
// }

// export const isRouteMatched = (pathname: string, routeConfig: routeConfig) => {
//   if (routeConfig.exact.includes(pathname)) {
//     return true
//   }

//   return routeConfig.pattern.some((pattern) => pattern.test(pathname))
// }

// export const getRouteOwner = (pathname: string) => {
//   if (isRouteMatched(pathname, commonProtectedRoutes)) {
//     return "COMMONPROTECTED"
//   }

//   if (isRouteMatched(pathname, adminProtectedRoutes)) {
//     return "ADMIN"
//   }

//   if (isRouteMatched(pathname, memberProtectedRoutes)) {
//     return "MEMBER"
//   }

//   return null
// }

export const getDefaultDashboardRoute = (role: UserRole | null) => {
  if (role === "ADMIN") {
    return "/dashboard"
  }
  if (role === "MEMBER") {
    return "/dashboard"
  }

  return "/"
}
