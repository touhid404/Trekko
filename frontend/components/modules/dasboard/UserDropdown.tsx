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
        <Button variant={"outline"} size={"icon"} className="rounded-none border-foreground bg-background">
          <span className="text-[12px] font-black">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-56 rounded-none border-foreground bg-background p-2">
        <DropdownMenuLabel className="px-3 py-4">
          <div className="flex flex-col space-y-1">
            <p className="text-[13px] font-black uppercase tracking-widest text-foreground">{userInfo?.name}</p>
            <p className="text-[10px] font-bold text-foreground/40">{userInfo?.email}</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.3em] text-foreground">
              Level: {userInfo?.role?.toLowerCase()}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-foreground/10" />

        <DropdownMenuItem className="focus:bg-foreground focus:text-background rounded-none cursor-pointer py-3">
          <Link href={"/my-profile"} className="flex w-full items-center text-[10px] font-black uppercase tracking-widest">
            <User className="mr-3 h-4 w-4" />
            Profile Access
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="focus:bg-foreground focus:text-background rounded-none cursor-pointer py-3">
          <Link href="/settings/change-password" className="flex w-full items-center text-[10px] font-black uppercase tracking-widest">
            <Key className="mr-3 h-4 w-4" />
            Security Key
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-foreground/10" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:bg-red-600 focus:text-white rounded-none py-3 text-[10px] font-black uppercase tracking-widest"
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {isLoggingOut ? "Processing..." : "Disconnect"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
