"use client"

import * as React from "react"
import Modal from "@/components/modules/member/modal"
import Image from "next/image"
import { Guide } from "@/services/admin/all-guides.service"

interface ViewGuideModalProps {
  guide: Guide | null
  isOpen: boolean
  onClose: () => void
}

export function ViewGuideModal({
  guide,
  isOpen,
  onClose,
}: ViewGuideModalProps) {
  if (!guide) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
  }

  type ItineraryItem = {
    day?: number
    title?: string
    activities?: string[]
    description?: string
  }

  const itineraryItems: ItineraryItem[] = React.useMemo(() => {
    if (!guide.itinerary) {
      return []
    }

    try {
      const parsed =
        typeof guide.itinerary === "string"
          ? JSON.parse(guide.itinerary)
          : guide.itinerary

      if (Array.isArray(parsed)) {
        return parsed
      }

      // If API returned object with itinerary key
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "itinerary" in parsed
      ) {
        const maybeItinerary = (parsed as any).itinerary
        if (Array.isArray(maybeItinerary)) {
          return maybeItinerary
        }
      }

      return []
    } catch (error) {
      console.warn("Failed to parse itinerary JSON", error)
      return []
    }
  }, [guide.itinerary])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="View Guide Details"
      size="xl"
    >
      <div className="space-y-6 p-4">
        {/* Cover Image */}
        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-muted">
          {guide.coverImage ? (
            <Image
              src={guide.coverImage}
              alt={guide.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Title and Status */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{guide.title}</h2>
              <p className="mt-1 text-muted-foreground">
                {guide.category.title}
              </p>
            </div>
            <div
              className={`inline-block rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${getStatusColor(guide.status)}`}
            >
              {getStatusLabel(guide.status)}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {guide.description}
          </p>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <h3 className="font-semibold">Price</h3>
          <p className="text-2xl font-bold">${guide.price.toFixed(2)}</p>
        </div>

        {/* Guide Details */}
        <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold">Member ID</h3>
            <p className="text-sm break-all text-muted-foreground">
              {guide.memberId}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Paid Guide</h3>
            <p className="text-sm text-muted-foreground">
              {guide.isPaid ? "Yes" : "No"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Created At</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(guide.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Updated At</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Itinerary */}
        {guide.itinerary && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Itinerary</h3>

            <div className="max-h-72 overflow-y-auto rounded-lg bg-muted p-4">
              {itineraryItems.length > 0 ? (
                <div className="space-y-3">
                  {itineraryItems.map((item, index) => (
                    <div
                      key={`itinerary-${index}`}
                      className="rounded-md border p-3"
                    >
                      <p className="text-sm font-medium text-primary">
                        Day {item.day ?? index + 1}: {item.title ?? "Untitled"}
                      </p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      {Array.isArray(item.activities) &&
                        item.activities.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {item.activities.map((activity, actIndex) => (
                              <li key={`activity-${index}-${actIndex}`}>
                                • {activity}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                  {guide.itinerary}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {guide.guideMedia && guide.guideMedia.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Gallery</h3>
            <div className="grid max-h-48 gap-3 overflow-y-auto sm:grid-cols-3">
              {guide.guideMedia.map((media) => (
                <div
                  key={media.id}
                  className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-muted"
                >
                  {media.type === "image" ? (
                    <Image
                      src={media.url}
                      alt="Guide media"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
