"use client"

import {
  getDrafts,
  DraftGuide,
  IQueryResult,
} from "@/app/actions/member/get-drafts"
import { Button } from "@/components/ui/button"
import DraftCard from "./draft-card"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { submitGuideForReview } from "@/app/actions/member/update-guide-status"

import { toast } from "sonner"
import { deleteDraft } from "@/app/actions/member/delete-draft"
import { Pagination } from "@/components/shared/Pagination"

interface DraftsListProps {
  initialData: IQueryResult<DraftGuide>
}

export default function DraftsList({ initialData }: DraftsListProps) {
  const searchParams = useSearchParams()
  const [data, setData] = useState<IQueryResult<DraftGuide>>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await getDrafts(page, 10)
      setData(response.data)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Failed to fetch drafts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (guide: DraftGuide) => {
    setSubmittingId(guide.id)
    try {
      const updatedGuide = await submitGuideForReview(guide.id)
      toast.success("Guide submitted for review successfully!")

      // Update the guides list with the submitted guide
      const updatedGuides = data.data.map((g) =>
        g.id === guide.id ? updatedGuide : g
      )
      setData((prev) => ({
        ...prev,
        data: updatedGuides,
      }))
    } catch (error: any) {
      console.error("Failed to submit guide:", error)
      toast.error(
        error?.response?.data?.message || "Failed to submit guide for review"
      )
    } finally {
      setSubmittingId(null)
    }
  }

  const handleEdit = (guide: DraftGuide) => {
    // Update the guides list with the edited guide
    const updatedGuides = data.data.map((g) => (g.id === guide.id ? guide : g))
    setData((prev) => ({
      ...prev,
      data: updatedGuides,
    }))
  }

  const handleDelete = async (guide: DraftGuide) => {
    setDeletingId(guide.id)
    try {
      await deleteDraft(guide.id)
      toast.success("Draft deleted successfully")
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((g) => g.id !== guide.id),
        meta: {
          ...prev.meta,
          total: prev.meta.total - 1,
        },
      }))
    } catch (error: any) {
      console.error("Failed to delete draft:", error)
      toast.error(error?.message || "Failed to delete draft")
    } finally {
      setDeletingId(null)
    }
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="mb-2 text-lg font-medium text-muted-foreground">
          No draft guides yet
        </p>
        <p className="text-sm text-muted-foreground">
          Start creating your first travel guide to see it here
        </p>
      </div>
    )
  }

  const { data: guides, meta } = data

  return (
    <div className="space-y-8">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <DraftCard
            key={guide.id}
            guide={guide}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isSubmitting={submittingId === guide.id}
            isDeleting={deletingId === guide.id}
          />
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages >= 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Pagination Info */}
      {meta && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {(currentPage - 1) * meta.limit + 1} to{" "}
          {Math.min(currentPage * meta.limit, meta.total)} of {meta.total}{" "}
          drafts
        </div>
      )}
    </div>
  )
}
