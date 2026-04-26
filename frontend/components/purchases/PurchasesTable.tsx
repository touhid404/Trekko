"use client"

import { Pagination } from "@/components/shared/Pagination"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Compass, Eye, MapPin } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Guide {
  id: string
  title: string
  coverImage?: string
  category: {
    title: string
  }
  price: number
  createdAt: string
}

interface PurchasesTableProps {
  guides: Guide[]
  totalPages?: number
  total?: number
  currentPage?: number
  onPageChange?: (page: number) => void
}

export function PurchasesTable({
  guides,
  totalPages = 1,
  total = 0,
  currentPage = 1,
  onPageChange,
}: PurchasesTableProps) {
  const router = useRouter()

  const handleView = (guideId: string) => {
    router.push(`/travel-guides/${guideId}`)
  }

  if (guides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <Compass className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-900">No Purchases Yet</h3>
        <p className="max-w-xs text-sm font-medium text-slate-500">
          When you purchase travel guides, they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guide</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Purchased On</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.map((guide) => (
              <TableRow key={guide.id} className="cursor-pointer" onClick={() => handleView(guide.id)}>
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
                      <span className="max-w-xs truncate font-bold text-sm text-slate-900">
                        {guide.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        ID-{guide.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {guide.category?.title || 'General'}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600">
                  {new Date(guide.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-sm font-bold text-slate-900">
                  ${guide.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-emerald-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleView(guide.id)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => {})}
          />
          <div className="text-xs font-semibold text-slate-400">
            Showing catalog manifest of {total} entries
          </div>
        </div>
      )}
    </div>
  )
}