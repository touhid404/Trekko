import { getNavItems } from "@/lib/navItems"
import { getUserInfo } from "@/services/auth.service"
import { NavSection } from "@/types/dashboard.navItems.types"
import DashboardSidebarContent from "./DashboardSidebarContent"

const DashboardSidebar = async () => {
  const userInfo = await getUserInfo()

  const navItems: NavSection[] = getNavItems(userInfo?.role)

  return (
    <DashboardSidebarContent
      navItems={navItems}
    />
  )
}

export default DashboardSidebar
