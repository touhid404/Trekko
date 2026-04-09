/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { axiosInstance, httpClient } from "@/lib/axios/httpClient"

interface GuidesFiltersProps {
  onSearch: (search: string) => void
  onSort: (sort: string) => void
  onCategoryFilter: (categoryId: string) => void
  onPaidFilter: (paid: string) => void
  onStatusFilter: (status: string) => void
  onPriceRangeFilter?: (minPrice: string, maxPrice: string) => void
  onClear?: () => void
  currentSearch?: string
  currentSort?: string
  currentCategory?: string
  currentPaid?: string
  currentStatus?: string
  currentMinPrice?: string
  currentMaxPrice?: string
}

export function GuidesFilters({
  onSearch,
  onSort,
  onCategoryFilter,
  onPaidFilter,
  onStatusFilter,
  onPriceRangeFilter,
  onClear,
  currentSearch = "",
  currentSort = "",
  currentCategory = "",
  currentPaid = "",
  currentStatus = "all",
  currentMinPrice = "",
  currentMaxPrice = "",
}: GuidesFiltersProps) {
  const [searchValue, setSearchValue] = React.useState(currentSearch)
  const [minPrice, setMinPrice] = React.useState(currentMinPrice)
  const [maxPrice, setMaxPrice] = React.useState(currentMaxPrice)
  const [statusValue, setStatusValue] = React.useState(currentStatus)
  const [categories, setCategories] = React.useState<
    { id: string; title: string; slug?: string }[]
  >([])

  React.useEffect(() => {
    setSearchValue(currentSearch)
  }, [currentSearch])

  React.useEffect(() => {
    setMinPrice(currentMinPrice)
    setMaxPrice(currentMaxPrice)
  }, [currentMinPrice, currentMaxPrice])

  React.useEffect(() => {
    setStatusValue(currentStatus)
  }, [currentStatus])

  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await httpClient.get<any>("/categories")
        let categoryData: any[] = []

        if (response.data && Array.isArray(response.data)) {
          categoryData = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          categoryData = response.data.data
        } else if (Array.isArray(response as any)) {
          categoryData = response as any
        }

        const normalized = categoryData.map((cat: any) => ({
          id: String(cat.id || cat._id || cat.slug || cat.title || cat.name),
          title: cat.title || cat.name || String(cat.slug || cat.id || ""),
          slug: cat.slug || cat.id || undefined,
        }))

        setCategories(normalized)
      } catch (error) {
        console.error("Failed to load categories in GuidesFilters:", error)
      }
    }

    loadCategories()
  }, [])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    onSearch(value)
  }

  const handleStatusChange = (status: string) => {
    setStatusValue(status)
    onStatusFilter(status)
  }

  const handlePriceRangeChange = (min: string, max: string) => {
    setMinPrice(min)
    setMaxPrice(max)
    onPriceRangeFilter?.(min, max)
  }

  const handleClearFilters = () => {
    setSearchValue("")
    setStatusValue("all")
    setMinPrice("")
    setMaxPrice("")

    onClear?.()
  }

  return (
    <div className="mb-8 space-y-4 rounded-lg border bg-card p-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search guides by title, keyword, or description..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters Row */}
      <div className="grid gap-4 md:grid-cols-5">
        {/* Sort */}
        {/* <Select value={currentSort} onValueChange={onSort}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="-createdAt">Recent</SelectItem>
            <SelectItem value="-voteCount">Top Voted</SelectItem>
            <SelectItem value="-commentCount">Most Commented</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Category Filter */}
        <Select value={currentCategory} onValueChange={onCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Payment Filter */}
        <Select value={currentPaid} onValueChange={onPaidFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="false">Free</SelectItem>
            <SelectItem value="true">Paid</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        {/* <Select value={statusValue} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select> */}

        {/* Price Range Container */}
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => handlePriceRangeChange(e.target.value, maxPrice)}
            min="0"
            className="flex-1"
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => handlePriceRangeChange(minPrice, e.target.value)}
            min="0"
            className="flex-1"
          />
        </div>

        {/* Clear Filters */}
        {(searchValue ||
          currentSort !== "all" ||
          currentCategory !== "all" ||
          currentPaid !== "all" ||
          statusValue !== "all" ||
          currentMinPrice ||
          currentMaxPrice) && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
      </div>
    </div>
  )
}
