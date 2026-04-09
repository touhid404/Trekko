"use client"

import { DraftGuide } from "@/app/actions/member/get-drafts"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import ViewDraftModal from "@/components/modules/member/view-draft-modal"

interface PublishedCardProps {
  guide: DraftGuide
}

export default function PublishedCard({ guide }: PublishedCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const handleViewClick = () => {
    setIsViewModalOpen(true)
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
              <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
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
            Published on{" "}
            {new Date(guide.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          {/* View Button */}
          <div className="mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleViewClick}
            >
              View Details
            </Button>
          </div>
        </div>
      </Card>

      {/* View Modal */}
      <ViewDraftModal
        guide={guide}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </>
  )
}
