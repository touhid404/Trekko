"use client"

import { getUnderReview } from "@/app/actions/member/getUnderReview"
import { DraftGuide, IQueryResult } from "@/app/actions/member/get-drafts"
import { useState } from "react"
import { Pagination } from "@/components/shared/Pagination"
import { Loader2, Eye, MapPin, Clock } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import ViewDraftModal from "@/components/modules/member/view-draft-modal"

interface UnderReviewListProps {
  initialData: IQueryResult<DraftGuide>
}

export default function UnderReviewList({ initialData }: UnderReviewListProps) {
  const [data, setData] = useState<IQueryResult<DraftGuide>>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedGuide, setSelectedGuide] = useState<DraftGuide | null>(null)

  const handlePageChange = async (page: number) => {
    if (page < 1 || !data.meta || page > data.meta.totalPages) return

    setIsLoading(true)
    try {
      const pageData = await getUnderReview(page, 10)
      setData(pageData)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Failed to fetch under review guides:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-amber-500">
          <Clock className="h-8 w-8" />
        </div>
        <p className="mb-2 text-lg font-bold text-slate-900">
          No guides currently under review
        </p>
        <p className="text-sm font-medium text-slate-500">
          Submit a guide and check back once it&apos;s in review.
        </p>
      </div>
    )
  }

  const { data: guides, meta } = data

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Guide</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="w-[15%]">Price</TableHead>
              <TableHead className="w-[15%]">Last Modified</TableHead>
              <TableHead className="text-right w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      {guide.coverImage ? (
                        <Image
                          src={guide.coverImage}
                          alt={guide.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MapPin className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="max-w-md truncate font-bold text-sm text-slate-900">
                        {guide.title}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                        {guide.description || "No description provided"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                    {guide.category?.title || 'General'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-bold text-slate-900">
                  {guide.isPaid ? `৳${guide.price.toLocaleString()}` : "Free"}
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600">
                  {new Date(guide.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages >= 1 && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
          {meta.total > 0 && (
            <div className="text-xs font-semibold text-slate-400">
              Showing {(currentPage - 1) * meta.limit + 1} to{" "}
              {Math.min(currentPage * meta.limit, meta.total)} of {meta.total} guides
            </div>
          )}
        </div>
      )}

      {selectedGuide && (
        <ViewDraftModal
          guide={selectedGuide}
          isOpen={!!selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}
    </div>
  )
}
