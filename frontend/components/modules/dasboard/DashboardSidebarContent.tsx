"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.navItems.types"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarContentProps {
  navItems: NavSection[]
}

const DashboardSidebarContent = ({
  navItems,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname()

  return (
    <div className="hidden h-full w-64 flex-col border-r border-gray-100 bg-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center px-8 border-b border-gray-100/50">
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <span className="text-xl font-black tracking-tight text-gray-900">
            TREKKO.
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="space-y-8 py-8 px-4">
            {navItems.map((section, sectionId) => (
              <div key={sectionId}>
                {section.title && (
                 <h4 className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
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
                          "group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                          isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                            isActive ? "text-emerald-500" : "text-gray-400 group-hover:text-gray-900"
                          )}
                        />
                        <span>{item.title}</span>

                        {/* Active indicator bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500" />
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
    </div>
  )
}

export default DashboardSidebarContent
