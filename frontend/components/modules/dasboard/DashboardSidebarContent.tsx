"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.navItems.types"
import { UserInfo } from "@/types/user.types"
import { Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarContentProps {
  userInfo: UserInfo
  navItems: NavSection[]
}

const DashboardSidebarContent = ({
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname()

  return (
    <div className="glass-effect hidden h-full w-64 flex-col border-r border-gray-100 md:flex">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
            <Home className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            Trekko<sup className="text-[10px] lowercase text-primary/60">hub</sup>
          </span>
        </Link>
      </div>

      {/* Profile Snapshot */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3 rounded-2xl bg-gray-900/5 p-3 ring-1 ring-gray-900/5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/60 text-white shadow-md">
            <span className="text-sm font-black">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-black text-gray-900">
              {userInfo?.name}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/60">
              {userInfo?.role?.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-8 pb-8">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  {section.title}
                </h4>
              )}

              <div className="group/nav space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href
                  const Icon = getIconComponent(item.icon)

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-bold transition-all duration-300",
                        isActive
                          ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]"
                          : "text-gray-500 hover:bg-white hover:text-primary hover:shadow-lg hover:shadow-gray-200/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-primary"
                        )}
                      />
                      <span>{item.title}</span>

                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute -left-1 h-5 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}

export default DashboardSidebarContent
