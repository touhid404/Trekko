"use client"

import { Pagination } from "@/components/shared/Pagination"
import { Calendar, ChevronRight, Compass, Globe, Star } from "lucide-react"
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
      <div className="flex flex-col items-center justify-center border border-foreground bg-background py-32 text-center">
        <div className="mb-10 flex h-24 w-24 items-center justify-center border border-foreground bg-foreground text-background">
          <Compass className="h-10 w-10" />
        </div>
        <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter text-foreground">PASSPORT EMPTY.</h3>
        <p className="max-w-xs text-[10px] font-bold uppercase tracking-widest leading-relaxed text-foreground opacity-40">
          BEGIN YOUR JOURNEY BY EXPLORING OUR CURATED REPOSITORIES. ONCE ACQUIRED, YOUR EXCLUSIVE TRAVEL INSIGHTS WILL BE INDEXED HERE.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => handleView(guide.id)}
            className="group relative cursor-pointer border border-foreground bg-background transition-all duration-500 hover:-translate-y-1"
          >
            {/* Architectural Image Header */}
            <div className="relative aspect-4/3 overflow-hidden border-b border-foreground">
              {guide.coverImage ? (
                <Image
                  src={guide.coverImage}
                  alt={guide.title}
                  fill
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-background grayscale">
                  <Compass className="h-16 w-16 text-foreground opacity-10" />
                </div>
              )}

              {/* Overlays */}
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center border border-foreground bg-background">
                  <Star className="h-4 w-4 text-foreground" />
                </div>
                <div className="border border-background bg-background px-4 py-2 text-[9px] font-black tracking-widest uppercase text-foreground">
                  ID-{guide.id.slice(0, 4)}
                </div>
              </div>

              <div className="absolute bottom-6 left-6">
                <div className="inline-flex items-center gap-3 border border-background bg-background px-5 py-2 text-[10px] font-black tracking-widest uppercase text-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  {guide.category?.title || 'General'}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-10">
              <h3 className="mb-8 line-clamp-2 text-2xl font-black leading-[0.9] tracking-tighter text-foreground uppercase">
                {guide.title}
              </h3>

              <div className="flex items-center justify-between border-t border-foreground pt-8">
                <div className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase text-foreground opacity-40">
                  <Calendar className="h-4 w-4" />
                  {new Date(guide.createdAt).getFullYear()}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-foreground transition-all hover:gap-5">
                  ARCHIVE ACCESS
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-12 py-20 border-t border-foreground">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => { })}
          />

          <div className="text-[10px] font-black tracking-[0.5em] uppercase text-foreground opacity-20 text-center">
            CATALOG MANIFEST: {total} ENTRIES
          </div>
        </div>
      )}
    </div>
  )
}