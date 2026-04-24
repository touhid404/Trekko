import DashboardNavber from "@/components/modules/dasboard/DashboardNavber"
import DashboardSidebar from "@/components/modules/dasboard/DashboardSidebar"
import { getUserInfo } from "@/services/auth.service"
import { redirect } from "next/navigation"

type DashboardLayoutProps = {
  children: React.ReactNode
  admin: React.ReactNode
  member: React.ReactNode
}

export default async function DashboardLayout({
  admin,
  member,
}: DashboardLayoutProps) {
  const userInfo = await getUserInfo()

  if (!userInfo) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Dashboard Sidebar */}
      <DashboardSidebar></DashboardSidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* DashboardNavbar */}
        <DashboardNavber></DashboardNavber>
        {/* <DashboardNavbar /> */}
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* Render children (commonProtected routes) first, then role-based slots */}
          <main className="flex-1 overflow-y-auto bg-background px-8 py-10">
            {/* 1. First render common protected routes */}

            {/* 2. Then render role-based content */}
            {userInfo?.role === "ADMIN" ? admin : member}
          </main>
        </main>
      </div>
    </div>
  )
}
