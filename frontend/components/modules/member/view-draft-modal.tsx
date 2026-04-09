"use client"

import { DraftGuide } from "@/app/actions/member/get-drafts"
import Modal from "./modal"

interface ViewDraftModalProps {
  guide: DraftGuide
  isOpen: boolean
  onClose: () => void
}

export default function ViewDraftModal({
  guide,
  isOpen,
  onClose,
}: ViewDraftModalProps) {
  const parsedItinerary = (() => {
    try {
      return JSON.parse(guide.itinerary || "[]")
    } catch {
      return []
    }
  })()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Draft Guide"
      description="Complete details of your draft guide"
      size="lg"
    >
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Title
          </label>
          <p className="mt-1 text-base font-semibold">{guide.title}</p>
        </div>

        {/* Category */}
        {guide.category && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Category
            </label>
            <p className="mt-1 text-base">{guide.category.title}</p>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            Description
          </label>
          <p className="mt-1 text-base whitespace-pre-wrap">
            {guide.description}
          </p>
        </div>

        {/* Price Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Pricing Type
            </label>
            <p className="mt-1 text-base">{guide.isPaid ? "Paid" : "Free"}</p>
          </div>
          {guide.isPaid && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Price (৳)
              </label>
              <p className="mt-1 text-base font-semibold text-green-600">
                ৳{guide.price.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Media Gallery */}
        {guide.guideMedia && guide.guideMedia.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Gallery ({guide.guideMedia.length} items)
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {guide.guideMedia.map((media) => (
                <a
                  key={media.id}
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg border transition-colors hover:border-primary"
                >
                  <img
                    src={media.url}
                    alt={media.type}
                    className="h-32 w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Itinerary */}
        {parsedItinerary && parsedItinerary.length > 0 && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Itinerary
            </label>
            <div className="mt-3 space-y-3">
              {parsedItinerary.map((day: any, idx: number) => (
                <div key={idx} className="border-l-2 border-blue-400 pl-4">
                  <p className="font-medium">
                    Day {day.day || idx + 1}: {day.title}
                  </p>
                  {day.activities && day.activities.length > 0 && (
                    <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                      {day.activities.map(
                        (activity: string, actIdx: number) => (
                          <li key={actIdx}>• {activity}</li>
                        )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Status
            </label>
            <p className="mt-1 text-sm font-semibold">{guide.status}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Created
            </label>
            <p className="mt-1 text-sm">
              {new Date(guide.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Updated
            </label>
            <p className="mt-1 text-sm">
              {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase">
              Guide ID
            </label>
            <p className="mt-1 truncate font-mono text-xs">{guide.id}</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
