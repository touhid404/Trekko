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
      <Card className="glass-effect premium-shadow group flex flex-col overflow-hidden rounded-[2rem] border-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <div className="relative h-48 w-full overflow-hidden">
          {guide.coverImage ? (
            <Image
              src={guide.coverImage}
              alt={guide.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">No Image</span>
            </div>
          )}
          {guide.category && (
            <div className="absolute left-4 top-4 z-10">
              <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                {guide.category.title}
              </span>
            </div>
          )}
        </div>

        <div className="flex grow flex-col p-6">
          <h3 className="mb-2 truncate text-xl font-black tracking-tight text-gray-900 group-hover:text-primary transition-colors">
            {guide.title}
          </h3>

          <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-gray-500">
            {guide.description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-gray-100/50 pt-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
            {guide.isPaid && (
              <p className="text-sm font-black text-primary">
                ৳{guide.price.toLocaleString()}
              </p>
            )}
          </div>

          <Button
            type="button"
            className="mt-6 w-full cursor-pointer rounded-xl bg-primary px-3 py-6 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
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
