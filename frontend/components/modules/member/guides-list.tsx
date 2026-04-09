"use client"

import * as React from "react"
import { GuideCard } from "@/components/modules/member/guide-card"
import { GuidesFilters } from "@/components/modules/member/guides-filters"
import { Pagination } from "@/components/modules/member/guides-pagination"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface Guide {
  id: string
  title: string
  description: string
  coverImage: string
  isPaid: boolean
  price?: number
  category?: { title: string; slug: string }
  guideMedia?: Array<{ url: string; type: string }>
  votes?: Array<{ type: "UPVOTE" | "DOWNVOTE" }>
  comments?: Array<{ id: string }>
  createdAt: string
}

interface GuidesListProps {
  initialData?: {
    guides: Guide[]
    totalPages: number
    total: number
  }
}

export function GuidesList({ initialData }: GuidesListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [guides, setGuides] = React.useState<Guide[]>(initialData?.guides || [])
  const [loading, setLoading] = React.useState(!initialData)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(
    initialData?.totalPages || 0
  )
  const [total, setTotal] = React.useState(initialData?.total || 0)

  // Get filters from URL params
  const searchTerm = searchParams.get("searchTerm") || ""
  const sort = searchParams.get("sort") || "all"
  const categoryId = searchParams.get("categoryId") || "all"
  const paid = searchParams.get("paid") || "all"
  const status = searchParams.get("status") || "all"
  const minPrice = searchParams.get("minPrice") || ""
  const maxPrice = searchParams.get("maxPrice") || ""

  // Update currentPage from URL on mount and param changes
  React.useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1")
    setCurrentPage(page)
  }, [searchParams])

  const updateParams = (updates: Partial<Record<string, string>>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    // Reset page to 1 when filters change
    params.set("page", "1")
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  const fetchGuides = React.useCallback(async () => {
    setLoading(true)
    try {
      const filterObj: Record<string, string> = {}

      if (categoryId !== "all") {
        filterObj["categoryId"] = categoryId
      }
      if (paid !== "all") {
        filterObj.isPaid = paid
      }
      if (status !== "all") {
        filterObj.status = status
      }
      if (minPrice) {
        filterObj["price[gte]"] = minPrice
      }
      if (maxPrice) {
        filterObj["price[lte]"] = maxPrice
      }

      const sortValue = sort !== "all" ? sort : undefined

      const result = await travelGuideServices.getAll(
        currentPage,
        9,
        sortValue,
        searchTerm || undefined,
        filterObj
      )

      if (result.success) {
        setGuides(result.data.data)
        setTotalPages(result.data.meta.totalPages)
        setTotal(result.data.meta.total)
      } else {
        toast.error("Failed to load guides")
      }
    } catch (error) {
      console.error("Error fetching guides:", error)
      toast.error("Error loading guides")
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    searchTerm,
    sort,
    categoryId,
    paid,
    status,
    minPrice,
    maxPrice,
  ])

  // Fetch guides when parameters change (but not on initial mount if we have initialData)
  React.useEffect(() => {
    if (
      initialData &&
      currentPage === 1 &&
      !searchTerm &&
      sort === "all" &&
      categoryId === "all" &&
      paid === "all" &&
      status === "all" &&
      !minPrice &&
      !maxPrice
    ) {
      // Skip fetch if we have initial data and no filters applied
      return
    }
    fetchGuides()
  }, [fetchGuides])

  const handleSearch = (search: string) => {
    updateParams({ searchTerm: search })
  }

  const handleSort = (sort: string) => {
    updateParams({ sort })
  }

  const handleCategoryFilter = (categoryId: string) => {
    updateParams({ categoryId })
  }

  const handlePaidFilter = (paid: string) => {
    updateParams({ paid })
  }

  const handleStatusFilter = (status: string) => {
    updateParams({ status })
  }

  const handlePriceRangeFilter = (minPrice: string, maxPrice: string) => {
    updateParams({ minPrice, maxPrice })
  }

  const handleClearFilters = () => {
    router.replace("?page=1", { scroll: false })
  }

  return (
    <>
      {/* Count Info */}
      {total > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {guides.length > 0 ? (currentPage - 1) * 9 + 1 : 0} to{" "}
          {Math.min(currentPage * 9, total)} of {total} guides
        </p>
      )}

      {/* Filters */}
      <GuidesFilters
        onSearch={handleSearch}
        onSort={handleSort}
        onCategoryFilter={handleCategoryFilter}
        onPaidFilter={handlePaidFilter}
        onStatusFilter={handleStatusFilter}
        onPriceRangeFilter={handlePriceRangeFilter}
        onClear={handleClearFilters}
        currentSearch={searchTerm}
        currentSort={sort || "all"}
        currentCategory={categoryId || "all"}
        currentPaid={paid || "all"}
        currentStatus={status || "all"}
        currentMinPrice={minPrice}
        currentMaxPrice={maxPrice}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading guides...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && guides.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-lg font-medium">No guides found</p>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Guides Grid */}
      {!loading && guides.length > 0 && (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 0 && (
        <div className="mb-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages || 1}
            onPageChange={(page) => {
              const normalized = Math.max(1, Math.min(page, totalPages || 1))
              setCurrentPage(normalized)
              const params = new URLSearchParams(searchParams)
              params.set("page", normalized.toString())
              router.replace(`?${params.toString()}`, { scroll: false })
            }}
          />
        </div>
      )}
    </>
  )
}
