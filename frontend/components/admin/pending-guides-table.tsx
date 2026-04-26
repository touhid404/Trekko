"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check, X, MapPin } from "lucide-react"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "@/components/ui/badge"
import { PendingGuide } from "@/services/admin/pending-guides.service"

interface PendingGuidesTableProps {
  guides: PendingGuide[]
  onApprove?: (guide: PendingGuide) => void
  onReject?: (guide: PendingGuide) => void
}

export function PendingGuidesTable({
  guides,
  onApprove,
  onReject,
}: PendingGuidesTableProps) {
  const handleApprove = (guide: PendingGuide) => {
    onApprove?.(guide)
  }

  const handleReject = (guide: PendingGuide) => {
    onReject?.(guide)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guides.map((guide) => (
            <TableRow key={guide.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    {guide?.coverImage ? (
                      <Image
                        src={guide.coverImage}
                        alt={guide.title || "Guide Cover"}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <MapPin className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="max-w-xs truncate font-bold text-sm text-slate-900">
                      {guide?.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      ID-{guide?.id?.slice(0, 8)}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{guide?.category?.title}</span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">
                  ${guide?.price?.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className="bg-amber-50 text-amber-600 border border-amber-100"
                >
                  {guide?.status?.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(guide?.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleApprove(guide)}
                      className="text-green-600 focus:text-green-600"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleReject(guide)}
                      className="text-destructive focus:text-destructive"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
