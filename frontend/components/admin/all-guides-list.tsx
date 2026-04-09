"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"
import { GuideCard } from "./guide-card"
import { AllGuidesFilters } from "./all-guides-filters"
import { ViewGuideModal } from "./view-guide-modal"
import { Pagination } from "@/components/modules/member/guides-pagination"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getAllGuidesAction } from "@/app/actions/admin/getAllGuidesAction"
import { deleteGuideAction } from "@/app/actions/admin/deleteGuideAction"
import { Guide } from "@/services/admin/all-guides.service"

const LIMIT = 12

interface AllGuidesListProps {
  initialGuides: Guide[]
  initialTotal: number
  initialPage: number
}

export function AllGuidesList({
  initialGuides,
  initialTotal,
  initialPage,
}: AllGuidesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [guides, setGuides] = React.useState<Guide[]>(initialGuides)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [totalGuides, setTotalGuides] = React.useState(initialTotal)
  const [selectedGuide, setSelectedGuide] = React.useState<Guide | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const currentSort = searchParams.get("sort") || "all"
  const currentStatus = searchParams.get("status") || "all"
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
      const filter =
        currentStatus !== "all" ? { status: currentStatus } : undefined
      const sort = currentSort === "all" ? undefined : currentSort

      const response = await getAllGuidesAction(
        currentPage,
        currentLimit,
        sort,
        undefined,
        filter
      )

      if (response) {
        setGuides(response.data || [])
        setTotalGuides(response.meta?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
      toast.error("Failed to fetch guides")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, currentLimit, currentSort, currentStatus])

  React.useEffect(() => {
    fetchGuides()
  }, [fetchGuides])

  const handleSort = (sort: string) => {
    updateParams({
      sort: sort === "all" ? null : sort,
      page: "1",
    })
    setCurrentPage(1)
  }

  const handleStatusFilter = (status: string) => {
    updateParams({
      status: status === "all" ? null : status,
      page: "1",
    })
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    updateParams({
      sort: null,
      status: null,
      page: null,
    })
    setCurrentPage(1)
  }

  const handleEdit = (guide: Guide) => {
    setSelectedGuide(guide)
    setIsModalOpen(true)
  }

  const handleRemove = async (guideId: string) => {
    const confirmed = await swal({
      title: "Are you sure?",
      text: "Do you want to delete this travel guide?",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    })

    if (!confirmed) return
    const toastId = toast.loading("Deleting guide...")

    setIsLoading(true)
    try {
      const result = await deleteGuideAction(guideId)

      if (result?.success) {
        await swal({
          title: "Deleted!",
          text: result.message || "Guide deleted successfully",
          icon: "success",
          buttons: ["OK"],
        })
        toast.success(result.message || "Guide deleted successfully", {
          id: toastId,
        })

        router.push("/dashboard/all-guides")
      } else {
        toast.error(result?.message || "Failed to delete guide", {
          id: toastId,
        })
        return
      }

      await fetchGuides()
    } catch (error) {
      console.error("Error deleting guide:", error)
      toast.error("Failed to delete guide")
      void swal({
        title: "Error",
        text: "An error occurred while deleting guide.",
        icon: "error",
        buttons: ["OK"],
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AllGuidesFilters
        onSort={handleSort}
        onStatusFilter={handleStatusFilter}
        onClear={handleClearFilters}
        currentSort={currentSort}
        currentStatus={currentStatus}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* No Results */}
      {!isLoading && guides.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No guides found</p>
          {(currentSort !== "all" || currentStatus !== "all") && (
            <Button
              variant="link"
              onClick={handleClearFilters}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Guides Grid */}
      {!isLoading && guides.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {guides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onView={handleEdit}
                onRemove={handleRemove}
              />
            ))}
          </div>

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

      {/* View Guide Modal */}
      <ViewGuideModal
        guide={selectedGuide}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedGuide(null)
        }}
      />
    </div>
  )
}
