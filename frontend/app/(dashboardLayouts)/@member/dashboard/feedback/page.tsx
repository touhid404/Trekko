/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { getRejectedGuides } from "@/actions/feedback/getRejectedGuidesAction"
import { FeedbackList } from "@/components/feedback/FeedbackList"
import { Loader2 } from "lucide-react"

interface FeedbackItem {
  feedback: string
  guide: {
    id: string
    title: string
    description: string
    status: string
  }
}

export default function MemberFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchFeedbacks = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getRejectedGuides(page, 10)
      if (result.success) {
        const data = (result as any).data || []
        const meta = (result as any).meta || {
          totalPages: 1,
          total: data.length,
        }
        setFeedbacks(data)
        setTotalPages(meta.totalPages)
        setTotal(meta.total)
        setCurrentPage(page)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Failed to fetch feedback")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks(1)
  }, [])

  const handlePageChange = (page: number) => {
    fetchFeedbacks(page)
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-rose-500">
            Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Feedback from Admins</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Moderation
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Feedback from Admins</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          View feedback and suggestions for your guides
        </p>
      </div>
      <div className="mt-8">
          {isLoading && feedbacks.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <FeedbackList
              feedbacks={feedbacks}
              totalPages={totalPages}
              total={total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  )
}
