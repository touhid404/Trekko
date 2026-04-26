"use client"

import { Pagination } from "@/components/shared/Pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertCircle, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FeedbackItem {
  feedback: string
  guide: {
    id: string
    title: string
    description: string
    status: string
  }
}

interface FeedbackListProps {
  feedbacks: FeedbackItem[]
  totalPages?: number
  total?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}

export function FeedbackList({
  feedbacks,
  totalPages = 1,
  total = 0,
  currentPage = 1,
  onPageChange,
}: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <MessageSquare className="h-8 w-8 text-rose-300" />
        </div>
        <p className="mb-2 text-lg font-bold text-slate-900">
          No feedback yet
        </p>
        <p className="text-sm font-medium text-slate-500">
          Feedback from admins will appear here once your guides are reviewed
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Guide</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[55%]">Feedback/Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbacks.map((item, index) => (
              <TableRow key={item.guide.id || index}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-sm text-slate-900">
                      {item.guide.title}
                    </span>
                    <span className="text-xs text-slate-500 line-clamp-1">
                      {item.guide.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                    {item.guide.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-3 items-start p-3 bg-red-50/50 rounded-xl border border-red-50">
                    <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-slate-700 font-medium">
                      {item.feedback}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages >= 1 && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
          {total > 0 && (
            <div className="text-xs font-semibold text-slate-400">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, total)} of {total} feedback items
            </div>
          )}
        </div>
      )}
    </div>
  )
}
