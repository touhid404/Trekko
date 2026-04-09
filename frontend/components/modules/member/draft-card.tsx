"use client"

import { DraftGuide } from "@/app/actions/member/get-drafts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import EditDraftModal from "@/components/modules/member/edit-draft-modal"
import ViewDraftModal from "@/components/modules/member/view-draft-modal"
import ConfirmationModal from "@/components/modules/member/confirmation-modal"

interface DraftCardProps {
  guide: DraftGuide
  onSubmit?: (guide: DraftGuide) => void
  onEdit?: (guide: DraftGuide) => void
  onDelete?: (guide: DraftGuide) => void
  isSubmitting?: boolean
  isDeleting?: boolean
}

export default function DraftCard({
  guide,
  onSubmit,
  onEdit,
  onDelete,
  isSubmitting,
  isDeleting,
}: DraftCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"submit" | "delete">(
    "submit"
  )

  const handleViewClick = () => {
    setIsViewModalOpen(true)
  }

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsEditModalOpen(false)
  }

  const handleSubmit = () => {
    setConfirmAction("submit")
    setIsConfirmModalOpen(true)
  }

  const handleDelete = () => {
    setConfirmAction("delete")
    setIsConfirmModalOpen(true)
  }

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false)
    if (onSubmit) {
      onSubmit(guide)
    }
  }

  const handleConfirmDelete = () => {
    setIsConfirmModalOpen(false)
    if (onDelete) {
      onDelete(guide)
    }
  }

  const handleEditSave = (updatedGuide: DraftGuide) => {
    setIsEditModalOpen(false)
    if (onEdit) {
      onEdit(updatedGuide)
    }
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
        {/* Cover Image */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {guide.coverImage ? (
            <Image
              src={guide.coverImage}
              alt={guide.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex grow flex-col p-4">
          {/* Category Badge */}
          {guide.category && (
            <div className="mb-2">
              <span className="inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                {guide.category.title}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="mb-2 truncate text-lg font-semibold">{guide.title}</h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {guide.description}
          </p>

          {/* Price */}
          {guide.isPaid && (
            <div className="mb-3">
              <p className="text-sm font-medium text-green-600">
                ৳{guide.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* Date */}
          <p className="mb-4 text-xs text-muted-foreground">
            {new Date(guide.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          {/* Buttons */}
          <div className="mt-auto space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleViewClick}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleEditClick}
              >
                Edit
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting || isSubmitting}
              >
                {isDeleting ? "deleting..." : "Delete"}
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* View Modal */}
      <ViewDraftModal
        guide={guide}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditDraftModal
        guide={guide}
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleEditSave}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={
          confirmAction === "submit" ? handleConfirmSubmit : handleConfirmDelete
        }
        title={
          confirmAction === "submit"
            ? "Submit Guide for Review"
            : "Delete Draft"
        }
        description={
          confirmAction === "submit"
            ? "Are you sure you want to submit this guide for review? Once submitted, it will be reviewed by moderators."
            : "Are you sure you want to delete this draft? This action cannot be undone."
        }
        confirmText={confirmAction === "submit" ? "Yes, Submit" : "Yes, Delete"}
        cancelText="Cancel"
        isLoading={isSubmitting}
      />
    </>
  )
}
