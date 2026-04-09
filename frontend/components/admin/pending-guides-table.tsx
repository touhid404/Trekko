"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check, X } from "lucide-react"
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
    <div className="rounded-md border">
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
              <TableCell className="max-w-xs font-medium">
                <div className="truncate" title={guide?.title}>
                  {guide.title}
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
                  className="bg-blue-100 text-blue-800"
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
