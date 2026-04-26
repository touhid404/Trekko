"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Member } from "@/services/admin/members.service"
import { updateMemberStatusAction } from "@/app/actions/admin/updateMemberStatusAction"
import { updateMemberRoleAction } from "@/app/actions/admin/updateMemberRoleAction"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { toast } from "sonner"
import swal from "sweetalert"
import { useRouter } from "next/navigation"

interface MembersTableProps {
  members: Member[]
}

export function MembersTable({ members }: MembersTableProps) {
  const [updatingMembers, setUpdatingMembers] = useState<Set<string>>(new Set())
  const router = useRouter()

  const handleStatusUpdate = async (
    memberId: string,
    status: "ACTIVE" | "INACTIVE"
  ) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `Do you want to ${status.toLowerCase()} this member?`,
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: status === "INACTIVE",
    })

    if (!confirmed) return

    setUpdatingMembers((prev) => new Set(prev).add(memberId))

    const toastId = toast.loading(`Updating member status to ${status}...`)
    try {
      const formData = new FormData()
      formData.append("memberId", memberId)
      formData.append("status", status)
      const result = await updateMemberStatusAction(formData)

      if (result.success) {
        toast.success(`Member status updated to ${status} successfully!`, {
          id: toastId,
        })
      } else {
        toast.error(result.error || "Failed to update member status", {
          id: toastId,
        })
      }
    } catch (error) {
      toast.error("An error occurred while updating member status", {
        id: toastId,
      })
    } finally {
      setUpdatingMembers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(memberId)
        return newSet
      })
    }
  }

  const handleRoleUpdate = async (
    memberId: string,
    role: "ADMIN" | "MEMBER"
  ) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: `Do you want to change this member's role to ${role}?`,
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: role === "MEMBER",
    })

    if (!confirmed) return

    setUpdatingMembers((prev) => new Set(prev).add(memberId))

    try {
      const formData = new FormData()
      formData.append("memberId", memberId)
      formData.append("role", role)
      const result = await updateMemberRoleAction(formData)

      if (result.success) {
        toast.success(`Member role updated to ${role} successfully!`)
      } else {
        toast.error(result.error || "Failed to update member role")
      }
    } catch (error) {
      toast.error("An error occurred while updating member role")
    } finally {
      setUpdatingMembers((prev) => {
        const newSet = new Set(prev)
        newSet.delete(memberId)
        return newSet
      })
    }
  }

  const isUpdating = (memberId: string) => updatingMembers.has(memberId)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Guides</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                    member.role === "ADMIN"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-gray-50 text-gray-600 border border-gray-100"
                  }`}
                >
                  {member.role}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                    (member.status || "ACTIVE") === "ACTIVE"
                      ? "bg-teal-50 text-teal-600 border border-teal-100"
                      : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}
                >
                  {member.status || "ACTIVE"}
                </span>
              </TableCell>
              <TableCell>{member._count.guides}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating(member.id)}
                      >
                        Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(member.id, "ACTIVE")}
                      >
                        ACTIVE
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(member.id, "INACTIVE")
                        }
                      >
                        INACTIVE
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating(member.id)}
                      >
                        Role
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleRoleUpdate(member.id, "ADMIN")}
                      >
                        ADMIN
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleUpdate(member.id, "MEMBER")}
                      >
                        MEMBER
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
