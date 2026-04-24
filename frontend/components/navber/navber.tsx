"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LogOut, Compass } from "lucide-react"
import { useState, useEffect } from "react"
import swal from "sweetalert"
import { UserInfo } from "@/types/user.types"
import { logoutActionForNavber } from "@/app/actions/auth/logout"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface NavbarProps {
  userInfo?: UserInfo | null
}

export function Navbar({ userInfo }: NavbarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/travel-guides", label: "Travel Guides" },
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


  const isHomePage = pathname === "/"
  const isTransparent = isHomePage && !isScrolled
  const textColorClass = isTransparent ? "text-white" : "text-foreground"

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isTransparent ? "bg-transparent py-6" : "bg-background/95 backdrop-blur-md shadow-sm py-2"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Compass className={cn("h-6 w-6", textColorClass)} />
            <span className={cn("text-xl font-bold tracking-tight", textColorClass)}>
              Trekko
            </span>
          </Link>

          {/* Center Nav Links - Glass Pill */}
          <div className={cn(
            "hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 transition-colors",
            isTransparent ? "bg-white/10 backdrop-blur-md border border-white/20" : "bg-gray-100/80"
          )}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-bold transition-all",
                  isActive(item.href)
                    ? (isTransparent ? "bg-white text-black shadow-lg" : "bg-white shadow-sm text-black")
                    : (isTransparent ? "text-white hover:bg-white/20" : "text-gray-500 hover:bg-gray-200 hover:text-gray-900")
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {!userInfo ? (
              <>
                <Link
                  href="/login"
                  className={cn("text-sm font-bold transition-colors hover:opacity-70", textColorClass)}
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    "px-6 py-2.5 text-sm font-bold rounded-full transition-transform hover:scale-105 shadow-sm",
                    isTransparent ? "bg-white text-black" : "bg-black text-white"
                  )}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative group">
                <button className={cn(
                  "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 transition-colors focus:outline-none",
                  isTransparent ? "border-white/20 bg-white/10" : "border-gray-200 bg-gray-50 hover:border-gray-300"
                )}>
                  {/* @ts-expect-error - Assuming profilePhoto exits*/}
                  {userInfo.profilePhoto || userInfo.profileImage ? (
                    // @ts-expect-error - image fallback
                    <Image src={userInfo.profilePhoto || userInfo.profileImage} alt={userInfo.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className={cn("text-sm font-bold", isTransparent ? "text-white" : "text-gray-700")}>
                      {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 translate-y-1 group-hover:translate-y-0">
                  <div className="mb-2 border-b border-gray-100 px-3 pb-3 pt-2">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {userInfo.name}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 truncate mt-0.5">
                      {userInfo.email}
                    </p>
                  </div>

                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="mt-1 flex w-full items-center rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Logout..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={cn("md:hidden", textColorClass)}
              onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full w-full border-b border-border bg-background py-4 shadow-xl md:hidden">
            <div className="flex flex-col gap-1 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-md px-4 py-3 text-sm font-semibold transition-colors",
                    isActive(item.href) ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border" />
              {!userInfo ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="rounded-md px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="mt-2 rounded-full bg-foreground px-4 py-3 text-center text-sm font-semibold text-background">
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="rounded-md px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => { setIsOpen(false); await handleLogout() }}
                    disabled={isLoggingOut}
                    className="flex w-full items-center rounded-md px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
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
