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
import { httpClient } from "@/lib/axios/httpClient"

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
    onClear?.()
  }

  return (
    <div className="mb-12 space-y-8 rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Search Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Find Your Next Adventure
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Browse our verified collection of premium travel itineraries and local experiences.
          </p>
        </div>
        
        <div className="relative flex-1 max-w-lg group">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-emerald-500" />
          <Input
            placeholder="Search destinations or guides..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="h-14 pl-12 pr-10 rounded-2xl border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900 transition-all focus-visible:ring-0 focus-visible:border-gray-300 focus-visible:bg-white placeholder:text-gray-400 shadow-sm"
          />
          {searchValue && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 ml-1">Genre</label>
          <Select value={currentCategory} onValueChange={onCategoryFilter}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-900 focus:ring-0 transition-colors hover:bg-gray-50">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 bg-white text-sm font-semibold text-gray-900 shadow-lg">
              <SelectItem value="all">Every Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Access Filter */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 ml-1">Access Level</label>
          <Select value={currentPaid} onValueChange={onPaidFilter}>
            <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-900 focus:ring-0 transition-colors hover:bg-gray-50">
              <SelectValue placeholder="Any Access" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-gray-100 bg-white text-sm font-semibold text-gray-900 shadow-lg">
              <SelectItem value="all">Any Access</SelectItem>
              <SelectItem value="false">Free Entries</SelectItem>
              <SelectItem value="true">Premium Entries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Ranger */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 ml-1">Credits Range</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => handlePriceRangeChange(e.target.value, maxPrice)}
                className="h-12 pl-7 rounded-2xl border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-900 transition-colors focus-visible:ring-0 focus-visible:bg-white hover:bg-gray-50"
              />
            </div>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">৳</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => handlePriceRangeChange(minPrice, e.target.value)}
                className="h-12 pl-7 rounded-2xl border-gray-200 bg-gray-50/50 text-sm font-semibold text-gray-900 transition-colors focus-visible:ring-0 focus-visible:bg-white hover:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Reset Actions */}
        <div className="flex items-end">
          {(searchValue ||
            currentSort !== "all" ||
            currentCategory !== "all" ||
            currentPaid !== "all" ||
            statusValue !== "all" ||
            currentMinPrice ||
            currentMaxPrice) ? (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="h-12 w-full gap-2 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Reset filters
              </Button>
            ) : (
              <div className="h-12 w-full" /> 
            )}
        </div>
      </div>
    </div>
  )
}
