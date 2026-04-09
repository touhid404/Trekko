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
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02] py-32 text-center backdrop-blur-3xl">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/5 text-white/10 border border-white/5">
          <Compass className="h-12 w-12 animate-pulse" />
        </div>
        <h3 className="mb-3 text-2xl font-black text-white uppercase tracking-tight">Your Passport is Empty</h3>
        <p className="max-w-xs text-sm leading-relaxed text-white/40">
          Begin your journey by exploring our curated guides. Once acquired, your exclusive travel insights will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-16">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => handleView(guide.id)}
            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0A0A0A] transition-all duration-700 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            {/* Immersive Image Header */}
            <div className="relative aspect-4/3 overflow-hidden">
              {guide.coverImage ? (
                <Image
                  src={guide.coverImage}
                  alt={guide.title}
                  fill
                  className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/5 grayscale">
                  <Compass className="h-16 w-16 text-white/10" />
                </div>
              )}

              {/* Overlays */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              {/* Badges */}
              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
                </div>
                <div className="rounded-full bg-black/40 px-3 py-1 text-[9px] font-black tracking-widest uppercase text-white/80 backdrop-blur-md border border-white/5">
                  ID-{guide.id.slice(0, 4)}
                </div>
              </div>

              <div className="absolute bottom-6 left-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-blue-400 backdrop-blur-xl border border-blue-500/20">
                  <Globe className="h-3.5 w-3.5" />
                  {guide.category?.title || 'General'}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8">
              <h3 className="mb-6 line-clamp-2 text-2xl font-black leading-tight tracking-tight text-white/90 transition-colors group-hover:text-blue-400">
                {guide.title}
              </h3>

              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-white/30">
                  <Calendar className="h-4 w-4" />
                  {new Date(guide.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/60 transition-all group-hover:text-white">
                  Open Guide
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Hover Decorative Line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-700 group-hover:w-full" />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-8 py-12 border-t border-white/5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange || (() => { })}
          />

          <div className="text-[10px] font-black tracking-[0.4em] uppercase text-white/10">
            Catalog Manifest: {total} Entries
          </div>
        </div>
      )}
    </div>
  )
}
