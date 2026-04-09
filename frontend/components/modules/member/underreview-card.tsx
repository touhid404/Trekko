"use client"

import { DraftGuide } from "@/app/actions/member/get-drafts"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import ViewDraftModal from "@/components/modules/member/view-draft-modal"
import { Button } from "@/components/ui/button"

interface UnderReviewCardProps {
  guide: DraftGuide
}

export default function UnderReviewCard({ guide }: UnderReviewCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
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

        <div className="flex grow flex-col p-4">
          {guide.category && (
            <div className="mb-2">
              <span className="inline-block rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                {guide.category.title}
              </span>
            </div>
          )}

          <h3 className="mb-2 truncate text-lg font-semibold">{guide.title}</h3>

          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {guide.description}
          </p>

          {guide.isPaid && (
            <p className="mb-3 text-sm font-medium text-green-600">
              ৳{guide.price.toLocaleString()}
            </p>
          )}

          <p className="mb-4 text-xs text-muted-foreground">
            Updated{" "}
            {new Date(guide.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>

          <Button
            type="button"
            className="mt-auto cursor-pointer rounded bg-[#1989A3] px-3 py-2 text-sm font-medium text-white hover:bg-[#1989A3]/90"
            onClick={() => setIsViewModalOpen(true)}
          >
            View Details
          </Button>
        </div>
      </Card>

      <ViewDraftModal
        guide={guide}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
    </>
  )
}
