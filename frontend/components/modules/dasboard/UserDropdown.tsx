/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import swal from "sweetalert"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserInfo } from "@/types/user.types"
import { toast } from "sonner"
import { logoutAction } from "@/app/actions/auth/logout"

import { Key, LogOut, User } from "lucide-react"
import Link from "next/link"

interface UserDropdownProps {
  userInfo: UserInfo
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "You will be logged out from the application.",
      icon: "warning",
      buttons: ["Cancel", "Logout"],
      dangerMode: true,
    })

    if (!confirmed) {
      return
    }

    setIsLoggingOut(true)

    try {
      const result = await logoutAction()

      if (!result.success) {
        toast.error(result.message || "Unable to logout")
        setIsLoggingOut(false)
        return
      }

      toast.success("Logged out successfully")
      // redirect is handled inside logoutAction
    } catch (error: any) {
      console.error("Logout error:", error)
      toast.error(error?.message || "Logout failed")
      setIsLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} className="h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 shadow-sm transition-all focus-visible:ring-emerald-500">
          <span className="text-sm font-bold">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-64 rounded-[2rem] border border-gray-100 bg-white/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <DropdownMenuLabel className="px-5 py-5 mb-2 rounded-[1.5rem] bg-gray-50/50">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-bold text-gray-900">{userInfo?.name}</p>
            <p className="text-xs font-semibold text-gray-500 truncate">{userInfo?.email}</p>
            <div className="mt-2 inline-flex">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                {userInfo?.role?.toLowerCase()}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-100/50 my-2" />

        <div className="space-y-1">
          <DropdownMenuItem className="cursor-pointer rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-600 transition-colors focus:bg-emerald-50 focus:text-emerald-600 outline-none">
            <Link href={"/my-profile"} className="flex w-full items-center">
              <User className="mr-3 h-4 w-4" />
              Manage Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-600 transition-colors focus:bg-emerald-50 focus:text-emerald-600 outline-none">
            <Link href="/settings/change-password" className="flex w-full items-center">
              <Key className="mr-3 h-4 w-4" />
              Security Settings
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-gray-100/50 my-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer rounded-2xl px-5 py-3.5 text-sm font-semibold text-rose-600 transition-colors focus:bg-rose-50 focus:text-rose-700 outline-none"
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {isLoggingOut ? "Disconnecting..." : "Sign Out Securely"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
