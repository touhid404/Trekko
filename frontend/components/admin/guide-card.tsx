"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { Guide } from "@/services/admin/all-guides.service"

interface GuideCardProps {
  guide: Guide
  onView?: (guide: Guide) => void
  onRemove?: (guideId: string) => void
}

export function GuideCard({ guide, onView, onRemove }: GuideCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-50/90 text-gray-700 border-gray-200"
      case "UNDER_REVIEW":
        return "bg-amber-50/90 text-amber-700 border-amber-200"
      case "APPROVED":
        return "bg-teal-50/90 text-teal-700 border-teal-200"
      case "REJECTED":
        return "bg-rose-50/90 text-rose-700 border-rose-200"
      default:
        return "bg-gray-50/90 text-gray-700 border-gray-200"
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, " ")
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-gray-100 bg-white transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-muted">
        {guide?.coverImage ? (
          <Image
            src={guide?.coverImage}
            alt={guide?.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <div
            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide backdrop-blur-md ${getStatusColor(guide?.status)}`}
          >
            {getStatusLabel(guide?.status)}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardHeader className="flex-1 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-lg leading-tight font-semibold">
              {guide?.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {guide?.category?.title}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {guide?.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="text-lg font-semibold">
            ${guide?.price?.toFixed(2)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={() => {
              onView?.(guide)
            }}
          >
            <Edit className="h-4 w-4" />
            View
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  onRemove?.(guide.id)
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}
