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
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      {/* Dashboard Sidebar */}
      <DashboardSidebar></DashboardSidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* DashboardNavbar */}
        <DashboardNavber></DashboardNavber>
        
        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 md:py-10">
          {/* Render role-based content */}
          {userInfo?.role === "ADMIN" ? admin : member}
        </main>
      </div>
    </div>
  )
}
