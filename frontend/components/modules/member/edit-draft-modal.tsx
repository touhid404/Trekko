"use client"

import { DraftGuide } from "@/app/actions/member/get-drafts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import Modal from "./modal"
import { updateDraft } from "@/app/actions/member/update-draft"
import { getCategories } from "@/app/actions/member/getCateforisAction"
import { toast } from "sonner"
import ItineraryEditor from "./itinerary-editor"
import { axiosInstance } from "@/lib/axios/httpClient"

interface CategoryOption {
  id: string
  title: string
}

interface EditDraftModalProps {
  guide: DraftGuide
  isOpen: boolean
  onClose: () => void
  onSave: (guide: DraftGuide) => void
}

export default function EditDraftModal({
  guide,
  isOpen,
  onClose,
  onSave,
}: EditDraftModalProps) {
  const [formData, setFormData] = useState<any>({
    ...guide,
    itinerary: (() => {
      try {
        return JSON.parse(guide.itinerary || "[]")
      } catch {
        return []
      }
    })(),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [coverImagePreview, setCoverImagePreview] = useState<string>(
    guide.coverImage || ""
  )

  useEffect(() => {
    setFormData({
      ...guide,
      itinerary: (() => {
        try {
          return JSON.parse(guide.itinerary || "[]")
        } catch {
          return []
        }
      })(),
    })
    setCoverImagePreview(guide.coverImage || "")
  }, [guide])

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const cats = await getCategories()
      if (Array.isArray(cats)) {
        setCategories(cats as any)
      }
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      price: value ? parseInt(value) : 0,
    }))
  }

  const handleIsPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      isPaid: e.target.checked,
    }))
  }

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string)
        setFormData((prev: any) => ({
          ...prev,
          coverImageFile: file, // Store file for upload
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleItineraryChange = (itinerary: any) => {
    setFormData((prev: any) => ({
      ...prev,
      itinerary,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        toast.error("Title is required")
        setIsLoading(false)
        return
      }

      if (!formData.description?.trim()) {
        toast.error("Description is required")
        setIsLoading(false)
        return
      }

      if (!formData.categoryId) {
        toast.error("Category is required")
        setIsLoading(false)
        return
      }

      const payload: any = {
        title: formData.title?.trim(),
        destination: formData.destination?.trim() || "",
        description: formData.description?.trim(),
        categoryId: formData.categoryId,
        isPaid: formData.isPaid === true || formData.isPaid === "true",
        price: formData.isPaid
          ? parseInt(String(formData.price || 0))
          : undefined,
        itinerary: Array.isArray(formData.itinerary) ? formData.itinerary : [],
      }

      // If there's a new cover image file, we need to use FormData
      if (formData.coverImageFile) {
        const formDataObj = new FormData()
        formDataObj.append("title", payload.title)
        formDataObj.append("destination", payload.destination || "")
        formDataObj.append("description", payload.description)
        formDataObj.append("categoryId", payload.categoryId)
        // Send as JSON string so backend preprocess can parse it
        formDataObj.append("itinerary", JSON.stringify(payload.itinerary))
        // Send as string "true" or "false"
        formDataObj.append("isPaid", String(payload.isPaid))
        // Send as string number
        formDataObj.append("price", String(payload.price || 0))
        formDataObj.append("coverImage", formData.coverImageFile)

        const response = await axiosInstance.put(
          `/travel-guides/${guide.id}`,
          formDataObj
        )
        if (response.data?.success) {
          toast.success("Draft updated successfully!")
          onSave(response.data.data)
          onClose()
        }
      } else {
        // No file upload, send JSON with proper types
        const updatedGuide = await updateDraft(guide.id, payload)
        toast.success("Draft updated successfully!")
        onSave(updatedGuide)
        onClose()
      }
    } catch (error: any) {
      console.error("Failed to update draft:", error)
      toast.error(
        error?.response?.data?.message || "Failed to update draft guide"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Draft Guide"
      description="Update your draft guide details below"
      size="lg"
    >
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Enter guide title"
          />
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination</label>
          <Input
            name="destination"
            value={formData.destination || ""}
            onChange={handleInputChange}
            placeholder="Enter destination"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            placeholder="Enter guide description"
            className="resize-none"
            rows={4}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleInputChange}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>
        </div>

        {/* Itinerary */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Itinerary</label>
          <ItineraryEditor
            value={formData.itinerary || []}
            onChange={handleItineraryChange}
          />
        </div>

        {/* Is Paid Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPaid"
            checked={formData.isPaid || false}
            onChange={handleIsPaidChange}
            className="h-4 w-4 cursor-pointer"
          />
          <label
            htmlFor="isPaid"
            className="cursor-pointer text-sm font-medium"
          >
            This is a paid guide
          </label>
        </div>

        {/* Price */}
        {formData.isPaid && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Price (৳)</label>
            <Input
              name="price"
              type="number"
              value={formData.price || 0}
              onChange={handlePriceChange}
              placeholder="Enter price"
              min="0"
            />
          </div>
        )}

        {/* Cover Image */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image</label>
          {coverImagePreview && (
            <div className="relative h-32 w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            PNG, JPG or GIF (max 5MB)
          </p>
        </div> */}

        {/* Buttons */}
        <div className="flex gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
