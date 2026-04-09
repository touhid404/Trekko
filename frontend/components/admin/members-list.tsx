"use client"

import * as React from "react"
import { MembersTable } from "@/components/admin/members-table"

import { Pagination } from "@/components/modules/member/guides-pagination"
import { getMembersAction } from "@/app/actions/admin/getMembersAction"
import { Member } from "@/services/admin/members.service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { MembersFilters } from "./members-filters"

interface MembersListProps {
  initialMembers: Member[]
  initialTotalPages: number
  initialTotal: number
  initialPage: number
}

export function MembersList({
  initialMembers,
  initialTotalPages,
  initialTotal,
  initialPage,
}: MembersListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialRenderRef = React.useRef(true)

  const [members, setMembers] = React.useState<Member[]>(initialMembers)
  const [loading, setLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [totalPages, setTotalPages] = React.useState(initialTotalPages)
  const [total, setTotal] = React.useState(initialTotal)

  // Get filters from URL params
  const searchTerm = searchParams.get("searchTerm") || ""
  const sort = searchParams.get("sort") || "all"
  const role = searchParams.get("role") || "all"
  const status = searchParams.get("status") || "all"

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

  const fetchMembers = React.useCallback(async () => {
    setLoading(true)
    try {
      const filterObj: Record<string, string> = {}

      if (role !== "all") {
        filterObj["role"] = role
      }
      if (status !== "all") {
        filterObj["status"] = status
      }

      const sortValue = sort !== "all" ? sort : undefined

      const result = await getMembersAction(
        currentPage,
        10,
        sortValue,
        searchTerm || undefined,
        filterObj
      )

      if (result) {
        setMembers((result as any)?.data || result?.data || [])
        setTotalPages(result?.meta?.totalPages || 0)
        setTotal(result?.meta?.total || 0)
      } else {
        toast.error("Failed to load members")
      }
    } catch (error) {
      console.error("Error fetching members:", error)
      toast.error("Error loading members")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchTerm, sort, role, status])

  // Only fetch when page/params change after initial render
  React.useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }
    fetchMembers()
  }, [currentPage, searchTerm, sort, role, status, fetchMembers])

  const handleSearch = (search: string) => {
    updateParams({ searchTerm: search })
  }

  const handleSort = (sort: string) => {
    updateParams({ sort })
  }

  const handleRoleFilter = (role: string) => {
    updateParams({ role })
  }

  const handleStatusFilter = (status: string) => {
    updateParams({ status })
  }

  const handleClearFilters = () => {
    router.replace("?page=1", { scroll: false })
  }

  return (
    <>
      {/* Count Info */}
      {total > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {members.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to{" "}
          {Math.min(currentPage * 10, total)} of {total} members
        </p>
      )}

      {/* Filters */}
      <MembersFilters
        onSearch={handleSearch}
        onSort={handleSort}
        onRoleFilter={handleRoleFilter}
        onStatusFilter={handleStatusFilter}
        onClear={handleClearFilters}
        currentSearch={searchTerm}
        currentSort={sort || "all"}
        currentRole={role || "all"}
        currentStatus={status || "all"}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading members...</p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && members.length === 0 && (
        <div className="rounded-lg border bg-card p-12 text-center">
          <p className="text-lg font-medium">No members found</p>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}

      {/* Members Table */}
      {!loading && members.length > 0 && (
        <div className="mb-8">
          <MembersTable members={members} />
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
