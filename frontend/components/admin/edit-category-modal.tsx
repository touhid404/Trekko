"use client"

import * as React from "react"
import { ZodError } from "zod"
import Modal from "@/components/modules/member/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Category } from "@/services/admin/categories.service"
import {
  CategoryValidationSchema,
  CategoryUpdateFormData,
} from "@/zod/category.validation"
import { toast } from "sonner"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")

interface EditCategoryModalProps {
  category: Category | null
  isOpen: boolean
  onClose: () => void
  onConfirm?: (
    categoryId: string,
    data: CategoryUpdateFormData
  ) => Promise<void>
  isLoading?: boolean
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: EditCategoryModalProps) {
  const [formData, setFormData] = React.useState<CategoryUpdateFormData>({
    slug: "",
    title: "",
    description: "",
  })
  const [originalSlug, setOriginalSlug] = React.useState("")
  const [errors, setErrors] = React.useState<Partial<CategoryUpdateFormData>>(
    {}
  )

  React.useEffect(() => {
    if (category) {
      setFormData({
        slug: category.slug,
        title: category.title,
        description: category.description,
      })
      setOriginalSlug(category.slug)
    }
  }, [category])

  const validateForm = (): boolean => {
    try {
      CategoryValidationSchema.update.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<CategoryUpdateFormData> = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof CategoryUpdateFormData
          if (field) {
            fieldErrors[field] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({})
      }
      return false
    }
  }

  const handleConfirm = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors")
      return
    }

    if (!category) return

    await onConfirm?.(category.id, formData)
  }

  const handleClose = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
    })
    setErrors({})
    onClose()
  }

  const handleInputChange = (
    field: keyof CategoryUpdateFormData,
    value: string
  ) => {
    let updatedValue = value
    if (field === "slug") {
      updatedValue = slugify(value)
    }

    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: updatedValue,
      }

      if (field === "title") {
        const normalizedSlug = slugify(value)
        if (!prev.slug || prev.slug === originalSlug) {
          updated.slug = normalizedSlug
        }
      }

      return updated
    })

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (!category) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Category"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="font-semibold">{category.title}</p>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(category.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-semibold">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              id="slug"
              placeholder="category-slug"
              value={formData.slug}
              onChange={(e) => handleInputChange("slug", e.target.value)}
              className={errors.slug ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="Category Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-semibold"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="description"
              placeholder="Category description..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-24 ${errors.description ? "border-red-500" : ""}`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Category"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
