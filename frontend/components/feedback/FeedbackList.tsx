"use client"

import { FeedbackCard } from "./FeedbackCard"
import { Pagination } from "@/components/shared/Pagination"

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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="mb-2 text-lg font-medium text-muted-foreground">
          No feedback yet
        </p>
        <p className="text-sm text-muted-foreground">
          Feedback from admins will appear here once your guides are reviewed
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((item, index) => (
          <FeedbackCard
            key={item.guide.id || index}
            feedback={item.feedback}
            guide={item.guide}
          />
        ))}
      </div>

      {totalPages >= 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
        </div>
      )}

      {total > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {(currentPage - 1) * 10 + 1} to{" "}
          {Math.min(currentPage * 10, total)} of {total} feedback items
        </div>
      )}
    </div>
  )
}
