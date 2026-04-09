"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
    <div className="hidden h-full w-64 flex-col overflow-y-auto border-r border-gray-100 bg-[#f9f9f9]/50 md:flex">
      {/* Logo / Brand */}
      <div className="flex h-16 shrink-0 items-center px-8">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Home className="h-5 w-5 text-gray-900" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Trekko<sup className="text-[10px] font-medium">™</sup>
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-8">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-3 px-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1.5">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href
                  const Icon = getIconComponent(item.icon)

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-200",
                        isActive
                          ? "bg-black text-white shadow-md shadow-black/10 scale-[1.02]"
                          : "text-gray-500 hover:bg-gray-200/50 hover:text-black"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-gray-400")} />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-6 block bg-gray-200/60" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="mt-auto border-t border-gray-100 bg-white/50 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white">
            <span className="text-xs font-black">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="truncate text-[13px] font-bold text-gray-900">{userInfo?.name}</p>
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
              {userInfo?.role?.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebarContent
