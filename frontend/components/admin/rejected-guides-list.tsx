"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"
import { RejectedGuidesTable } from "./rejected-guides-table"
import { Pagination } from "@/components/modules/member/guides-pagination"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getRejectedGuidesAction } from "@/app/actions/admin/getRejectedGuidesAction"
import { approveRejectedGuideAction } from "@/app/actions/admin/approveRejectedGuideAction"
import { RejectedGuide } from "@/services/admin/rejected-guides.service"

const LIMIT = 10

export function RejectedGuidesList() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [guides, setGuides] = React.useState<RejectedGuide[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalGuides, setTotalGuides] = React.useState(0)
  const [isProcessing, setIsProcessing] = React.useState(false)

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
      const response = await getRejectedGuidesAction(currentPage, currentLimit)

      if (response) {
        setGuides(response.data || [])
        setTotalGuides(response.meta?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching rejected guides:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, currentLimit])

  React.useEffect(() => {
    fetchGuides()
  }, [fetchGuides])

  const handleApproveGuide = async (guide: RejectedGuide) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "Do you want to approve this guide?",
      icon: "warning",
      buttons: ["Cancel", "Approve"],
      dangerMode: false,
    })

    if (!confirmed) return
    const taostId = toast.loading("Approving guide...")

    setIsProcessing(true)
    try {
      const result = await approveRejectedGuideAction(guide.id)

      if (result?.success) {
        await swal({
          title: "Approved!",
          text: result.message || "Guide approved successfully",
          icon: "success",
          buttons: ["OK"],
        })
        toast.success(result.message || "Guide approved successfully", {
          id: taostId,
        })

        // Remove approved guide from list
        setGuides((prev) => prev.filter((g) => g.id !== guide.id))
        setTotalGuides((prev) => Math.max(0, prev - 1))
      } else {
        toast.error(result?.message || "Failed to approve guide", {
          id: taostId,
        })
      }
    } catch (error) {
      console.error("Error approving guide:", error)
      toast.error("Failed to approve guide", { id: taostId })
      void swal({
        title: "Error",
        text: "An error occurred while approving guide.",
        icon: "error",
        buttons: ["OK"],
      })
    } finally {
      setIsProcessing(false)
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
          <p className="text-muted-foreground">No rejected guides found</p>
        </div>
      )}

      {/* Guides Table */}
      {!isLoading && guides.length > 0 && (
        <>
          <RejectedGuidesTable guides={guides} onApprove={handleApproveGuide} />

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
    </div>
  )
}
