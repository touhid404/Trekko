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
    <div className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-8">
      {/* Mobile Menu Toggle Button And Menu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant={"outline"} size={"icon"} className="rounded-none border-foreground hover:bg-muted">
            <Menu className="h-5 w-5 text-foreground" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 border-r border-border bg-background">
          <DashboardMobileSidbar
            userInfo={userInfo}
            dashboardHome={dashboardHome}
            navItems={navItems}
          />
        </SheetContent>
      </Sheet>

      {/* Breadcrumb or Empty flexible spacer */}
      <div className="flex flex-1 items-center">
        <div className="hidden items-center gap-2 md:flex">
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground">
            Session: <span className="opacity-40">{userInfo?.name || "Anonymous"}</span>
          </h2>
        </div>
      </div>

      {/* Right side action - Icons container */}
      <div className="flex items-center gap-4">
        {/* user dropdown */}
        <div className="transition-all">
          <UserDropdown userInfo={userInfo}></UserDropdown>
        </div>
      </div>
    </div>
  )
}
