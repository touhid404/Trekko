"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"
import { CategoriesTable } from "./categories-table"
import { EditCategoryModal } from "./edit-category-modal"
import { Pagination } from "@/components/modules/member/guides-pagination"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getCategoriesAction } from "@/app/actions/admin/getCategoriesAction"
import { updateCategoryAction } from "@/app/actions/admin/updateCategoryAction"
import { deleteCategoryAction } from "@/app/actions/admin/deleteCategoryAction"
import { Category } from "@/services/admin/categories.service"
import { CategoryUpdateFormData } from "@/zod/category.validation"

const LIMIT = 10

interface CategoriesListProps {
  initialCategories: Category[]
  initialTotal: number
  initialPage: number
}

export function CategoriesList({
  initialCategories,
  initialTotal,
  initialPage,
}: CategoriesListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(initialPage)
  const [totalCategories, setTotalCategories] = React.useState(initialTotal)
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const currentLimit = LIMIT
  const totalPages = Math.ceil(totalCategories / currentLimit)

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

  // Fetch categories
  const fetchCategories = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getCategoriesAction(currentPage, currentLimit)

      if (response) {
        setCategories(response.data?.data || [])
        setTotalCategories(response.data?.meta?.total || 0)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, currentLimit])

  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const confirmed = await swal({
      title: "Are you sure?",
      text: `Do you want to delete the category "${category.title}"? This action cannot be undone.`,
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    })

    if (!confirmed) return

    const toastId = toast.loading("Deleting category...")

    setIsDeleting(true)
    try {
      const result = await deleteCategoryAction(categoryId)

      if (result?.success) {
        await swal({
          title: "Deleted!",
          text: result.message || "Category deleted successfully",
          icon: "success",
          buttons: ["OK"],
        })
        toast.success(result.message || "Category deleted successfully", {
          id: toastId,
        })

        // Remove deleted category from list
        setCategories((prev) => prev.filter((c) => c.id !== categoryId))
        setTotalCategories((prev) => Math.max(0, prev - 1))
      } else {
        toast.error(result?.message || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
      void swal({
        title: "Error",
        text: "An error occurred while deleting category.",
        icon: "error",
        buttons: ["OK"],
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConfirmEdit = async (
    categoryId: string,
    data: CategoryUpdateFormData
  ) => {
    setIsUpdating(true)
    try {
      const result = await updateCategoryAction(categoryId, data)

      if (result?.success) {
        toast.success(result.message || "Category updated successfully")

        // Update category in list
        setCategories((prev) =>
          prev.map((c) =>
            c.id === categoryId
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c
          )
        )

        setIsEditModalOpen(false)
        setSelectedCategory(null)
      } else {
        toast.error(result?.message || "Failed to update category")
      }
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    } finally {
      setIsUpdating(false)
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
      {!isLoading && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <p className="text-muted-foreground">No categories found</p>
        </div>
      )}

      {/* Categories Table */}
      {!isLoading && categories.length > 0 && (
        <>
          <CategoriesTable
            categories={categories}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
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

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={selectedCategory}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedCategory(null)
        }}
        onConfirm={handleConfirmEdit}
        isLoading={isUpdating}
      />
    </div>
  )
}
