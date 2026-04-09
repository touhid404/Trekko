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

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
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
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(guide?.status)}`}
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
