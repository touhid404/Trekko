"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.navItems.types"
import { UserInfo } from "@/types/user.types"
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
    <div className="hidden h-full w-64 flex-col border-r border-border bg-background md:flex">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center px-8 border-b border-border">
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="text-xl font-black uppercase tracking-tighter text-foreground">
            TREKKO.
          </span>
        </Link>
      </div>

      {/* Profile Snapshot */}
      <div className="px-6 py-10 border-b border-border">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-foreground bg-foreground text-background">
            <span className="text-xl font-black">
              {userInfo?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-[12px] font-black uppercase tracking-widest text-foreground">
              {userInfo?.name}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              {userInfo?.role?.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="space-y-12 py-10 px-6">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-foreground opacity-30">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href
                  const Icon = getIconComponent(item.icon)

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "group relative flex items-center gap-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/40 hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground"
                        )}
                      />
                      <span>{item.title}</span>

                      {/* Active indicator bar */}
                      {isActive && (
                        <div className="absolute -left-6 h-full w-1 bg-foreground" />
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
