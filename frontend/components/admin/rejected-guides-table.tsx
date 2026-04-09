"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Check } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { Badge } from "@/components/ui/badge"
import { RejectedGuide } from "@/services/admin/rejected-guides.service"

interface RejectedGuidesTableProps {
  guides: RejectedGuide[]
  onApprove?: (guide: RejectedGuide) => void
}

export function RejectedGuidesTable({
  guides,
  onApprove,
}: RejectedGuidesTableProps) {
  const handleApprove = (guide: RejectedGuide) => {
    onApprove?.(guide)
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
                  {guide?.title}
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
                <Badge variant="secondary" className="bg-red-100 text-red-800">
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
