"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface MembersFiltersProps {
  onSearch: (search: string) => void
  onSort: (sort: string) => void
  onRoleFilter: (role: string) => void
  onStatusFilter: (status: string) => void
  onClear?: () => void
  currentSearch?: string
  currentSort?: string
  currentRole?: string
  currentStatus?: string
}

export function MembersFilters({
  onSearch,
  onSort,
  onRoleFilter,
  onStatusFilter,
  onClear,
  currentSearch = "",
  currentSort = "all",
  currentRole = "all",
  currentStatus = "all",
}: MembersFiltersProps) {
  const [searchValue, setSearchValue] = React.useState(currentSearch)

  React.useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }

  const handleSearchSubmit = () => {
    onSearch(searchValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  const hasActiveFilters =
    currentSearch ||
    currentSort !== "all" ||
    currentRole !== "all" ||
    currentStatus !== "all"

  return (
    <div className="mb-8 space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Search Input */}
      <div>
        <label className="mb-2 block text-sm font-medium">Search</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email..."
              value={searchValue}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearchSubmit} variant="default">
            Search
          </Button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
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

        {/* Role Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium">Role</label>
          <Select value={currentRole} onValueChange={onRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MEMBER">Member</SelectItem>
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
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
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
