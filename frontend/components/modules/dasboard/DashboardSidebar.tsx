import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItems } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/dashboard.navItems.types"
import DashboardSidebarContent from "./DashboardSidebarContent"

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  const navItems: NavSection[] = getNavItems(userInfo?.role)

  const dashboardHome = getDefaultDashboardRoute(userInfo?.role)

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  )
}

export default DashboardSidebar
