"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"

interface AllGuidesFiltersProps {
  onSort: (sort: string) => void
  onStatusFilter: (status: string) => void
  onClear?: () => void
  currentSort?: string
  currentStatus?: string
}

export function AllGuidesFilters({
  onSort,
  onStatusFilter,
  onClear,
  currentSort = "all",
  currentStatus = "all",
}: AllGuidesFiltersProps) {
  const hasActiveFilters = currentSort !== "all" || currentStatus !== "all"

  return (
    <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Sort */}
        <div>
          <label className="mb-2 block text-sm font-medium">Sort By</label>
          <Select value={currentSort} onValueChange={onSort}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="createdAt">Ascending</SelectItem>
              <SelectItem value="-createdAt">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Status</label>
          <Select value={currentStatus} onValueChange={onStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
