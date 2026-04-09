import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItems } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/dashboard.navItems.types"
import DashboardNavberContent from "./DashboardNavberContent"

export default async function DashboardNavber() {
  const userInfo = await getUserInfo()

  const navItems: NavSection[] = getNavItems(userInfo?.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role)
  return (
    <div>
      <DashboardNavberContent
        dashboardHome={dashboardHome}
        navItems={navItems}
        userInfo={userInfo}
      ></DashboardNavberContent>
    </div>
  )
}
