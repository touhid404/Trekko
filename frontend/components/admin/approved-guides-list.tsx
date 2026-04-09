"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"
import { ApprovedGuidesTable } from "./approved-guides-table"
import { RejectGuideModal } from "./reject-guide-modal"
import { Pagination } from "@/components/modules/member/guides-pagination"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getApprovedGuidesAction } from "@/app/actions/admin/getApprovedGuidesAction"
import { rejectGuideAction } from "@/app/actions/admin/rejectGuideAction"
import { ApprovedGuide } from "@/services/admin/approved-guides.service"

const LIMIT = 10

export function ApprovedGuidesList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [guides, setGuides] = React.useState<ApprovedGuide[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalGuides, setTotalGuides] = React.useState(0)
  const [selectedGuide, setSelectedGuide] =
    React.useState<ApprovedGuide | null>(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false)
  const [isRejecting, setIsRejecting] = React.useState(false)

  const currentLimit = LIMIT
  const totalPages = Math.ceil(totalGuides / currentLimit)

  // Update currentPage from URL on mount and param changes
  React.useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1")
    setCurrentPage(page)
  }, [searchParams])

  // Update URL parameters
  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })

      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Fetch guides
  const fetchGuides = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getApprovedGuidesAction(currentPage, currentLimit)

      if (response) {
        setGuides(response.data || [])
        setTotalGuides(response.meta?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching approved guides:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, currentLimit])

  React.useEffect(() => {
    fetchGuides()
  }, [fetchGuides])

  const handleRejectGuide = (guide: ApprovedGuide) => {
    setSelectedGuide(guide)
    setIsRejectModalOpen(true)
  }

  const handleConfirmReject = async (feedback: string) => {
    if (!selectedGuide) return

    const confirmed = await swal({
      title: "Are you sure?",
      text: "Do you want to reject this guide?",
      icon: "warning",
      buttons: ["Cancel", "Reject"],
      dangerMode: true,
    })

    if (!confirmed) return

    setIsRejecting(true)
    try {
      const result = await rejectGuideAction(selectedGuide.id, feedback)

      if (result?.success) {
        await swal({
          title: "Rejected!",
          text: result.message || "Guide rejected successfully",
          icon: "success",
          buttons: ["OK"],
        })
        toast.success(result.message || "Guide rejected successfully")

        // Remove rejected guide from list
        setGuides((prev) => prev.filter((g) => g.id !== selectedGuide.id))
        setTotalGuides((prev) => Math.max(0, prev - 1))

        setIsRejectModalOpen(false)
        setSelectedGuide(null)
      } else {
        toast.error(result?.message || "Failed to reject guide")
      }
    } catch (error) {
      console.error("Error rejecting guide:", error)
      toast.error("Failed to reject guide")
      void swal({
        title: "Error",
        text: "An error occurred while rejecting guide.",
        icon: "error",
        buttons: ["OK"],
      })
    } finally {
      setIsRejecting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* No Results */}
      {!isLoading && guides.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No approved guides found</p>
        </div>
      )}

      {/* Guides Table */}
      {!isLoading && guides.length > 0 && (
        <>
          <ApprovedGuidesTable
            guides={guides}
            onRejectGuide={handleRejectGuide}
          />

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="mb-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={(page) => {
                  const normalized = Math.max(
                    1,
                    Math.min(page, totalPages || 1)
                  )
                  setCurrentPage(normalized)
                  updateParams({ page: normalized.toString() })
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Reject Guide Modal */}
      <RejectGuideModal
        guide={selectedGuide}
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false)
          setSelectedGuide(null)
        }}
        onConfirm={handleConfirmReject}
        isLoading={isRejecting}
      />
    </div>
  )
}
