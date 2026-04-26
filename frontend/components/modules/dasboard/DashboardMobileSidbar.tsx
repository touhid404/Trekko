import Link from "next/link"
import { usePathname } from "next/navigation"

import { getIconComponent } from "@/lib/iconMapper"
import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.navItems.types"
import { SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardMobileSidebarProps {
  navItems: NavSection[]
  dashboardHome: string
}

export default function DashboardMobileSidbar({
  navItems,
  dashboardHome,
}: DashboardMobileSidebarProps) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100/50">
        <Link href={dashboardHome}>
          <span className="text-xl font-black tracking-tight text-gray-900">TREKKO.</span>
        </Link>
      </div>

      <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

      {/* Navigation Area  */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-4 py-6">
          <nav className="space-y-6">
            {navItems.map((section, sectionId) => (
              <div key={sectionId}>
                {section.title && (
                  <h4 className="mb-3 px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
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
                          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                          isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <Icon className={cn(
                          "h-4 w-4 transition-transform duration-300", 
                          isActive ? "text-emerald-500 scale-110" : "text-gray-400"
                        )} />
                        <span className="flex-1">{item.title}</span>
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
