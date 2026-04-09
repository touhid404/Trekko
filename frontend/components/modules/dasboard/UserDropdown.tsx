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
        <Button variant={"outline"} size={"icon"} className="rounded-full">
          <span className="text-sm font-semibold">
            {userInfo?.name?.charAt(0).toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={"end"} className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{userInfo?.name}</p>

            <p className="text-xs text-muted-foreground">{userInfo?.email}</p>

            <p className="text-xs text-primary capitalize">
              {userInfo?.role?.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={"/my-profile"}>
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/settings/change-password">
            <Key className="mr-2 h-4 w-4" />
            Change Password
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600"
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserDropdown
