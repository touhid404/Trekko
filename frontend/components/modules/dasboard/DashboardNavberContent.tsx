"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { NavSection } from "@/types/dashboard.navItems.types"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import UserDropdown from "./UserDropdown"
import DashboardMobileSidbar from "./DashboardMobileSidbar"
import { UserInfo } from "@/types/user.types"

interface DashboardNavberrContentProps {
  userInfo: UserInfo
  navItems: NavSection[]
  dashboardHome: string
}

export default function DashboardNavberContent({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavberrContentProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkSmallerScreen = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkSmallerScreen()
    window.addEventListener("resize", checkSmallerScreen)

    return () => {
      window.removeEventListener("resize", checkSmallerScreen)
    }
  }, [])
  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 md:px-8">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant={"outline"} size={"icon"} className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all hover:border-gray-300">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 border-r border-gray-100 bg-white">
          <DashboardMobileSidbar
            dashboardHome={dashboardHome}
            navItems={navItems}
          />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb or Empty flexible spacer */}
      <div className="flex flex-1 items-center">
        <div className="hidden items-center gap-2 md:flex">
          <h2 className="text-sm font-semibold text-gray-500">
            Welcome back, <span className="font-bold text-gray-900">{userInfo?.name || "Anonymous"}</span>
          </h2>
        </div>
      </div>

      {/* Right side action - Icons container */}
      <div className="flex items-center gap-4">
        <div className="transition-all">
          <UserDropdown userInfo={userInfo}></UserDropdown>
        </div>
      </div>
    </div>
  )
}
