"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, Compass } from "lucide-react"
import { useState, useEffect } from "react"
import swal from "sweetalert"
import { UserInfo } from "@/types/user.types"
import { logoutActionForNavber } from "@/app/actions/auth/logout"
import { cn } from "@/lib/utils"

interface NavbarProps {
  userInfo?: UserInfo | null
}

export function Navbar({ userInfo }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/travel-guides", label: "Guides" },
    { href: "/blog", label: "Blog" },
    { href: "/about-us", label: "About" },
  ]

  const isActive = (href: string) => pathname === href

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    const shouldLogout = await swal({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      buttons: ["Cancel", "Logout"],
      dangerMode: true,
    })
    if (!shouldLogout) return
    setIsLoggingOut(true)
    try {
      await logoutActionForNavber()
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  const isTransparent = isHomePage && !isScrolled

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent
          ? "bg-transparent py-5"
          : "border-b border-gray-100 bg-white/95 backdrop-blur-md py-3 shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Compass className={cn("h-6 w-6", isTransparent ? "text-white" : "text-black")} />
            <span className={cn("text-xl font-black tracking-tight", isTransparent ? "text-white" : "text-black")}>
              Trekko
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[13px] font-semibold transition-all",
                  isActive(item.href)
                    ? isTransparent
                      ? "bg-white/20 text-white backdrop-blur-sm"
                      : "bg-gray-100 text-black"
                    : isTransparent
                      ? "text-white/80 hover:bg-white/10 hover:text-white"
                      : "text-gray-500 hover:bg-gray-50 hover:text-black"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {!userInfo ? (
              <>
                <Link
                  href="/login"
                  className={cn(
                    "rounded-full px-5 py-2 text-[13px] font-semibold transition-colors",
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "rounded-full px-6 py-2.5 text-[13px] font-bold transition-transform hover:scale-105",
                    isTransparent
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  )}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className={cn(
                  "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 transition-colors focus:outline-none",
                  isTransparent ? "border-white/30 hover:border-white" : "border-gray-200 bg-gray-100 hover:border-gray-300"
                )}>
                  {/* @ts-expect-error - Assuming profilePhoto or similar exists, fallback to initial */}
                  {userInfo.profilePhoto || userInfo.profileImage ? (
                    // @ts-expect-error - image fallback
                    <img src={userInfo.profilePhoto || userInfo.profileImage} alt={userInfo.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className={cn(
                      "text-sm font-bold",
                      isTransparent ? "text-white" : "text-gray-500"
                    )}>
                      {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  <div className="mb-2 border-b border-gray-50 px-3 pb-3 pt-2">
                    <p className="text-[13px] font-bold text-gray-900 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 truncate">
                      {userInfo.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-3 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-[13px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn("md:hidden", isTransparent ? "text-white" : "text-black")}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full w-full border-b bg-white py-4 shadow-lg md:hidden">
            <div className="flex flex-col gap-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                    isActive(item.href) ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-gray-100" />
              {!userInfo ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="rounded-xl bg-black px-4 py-3 text-center text-sm font-bold text-white">
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => { setIsOpen(false); await handleLogout() }}
                    disabled={isLoggingOut}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
