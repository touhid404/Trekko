/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { MessageCircle, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface GuideCard {
  id: string
  title: string
  category: string
  image: string
  votes: number
  commentsCount: number
  isPaid: boolean
  price?: number
}

interface FeaturedGuidesProps {
  guides: any[]
}

export default function FeaturedGuides({ guides }: FeaturedGuidesProps) {
  const transformedGuides: GuideCard[] = guides.map((guide) => {
    const totalVotes = Array.isArray(guide.votes)
      ? guide.votes.length
      : typeof guide.votes === "number"
        ? guide.votes
        : Number(guide.votes) || 0

    const commentsCount =
      guide.comments?.filter((comment: any) => comment && !comment.isDeleted)
        .length ?? 0

    const imageUrl =
      guide.coverImage || guide.guideMedia?.[0]?.url || "/assets/hero.jpg"

    return {
      id: guide.id,
      title: guide.title,
      category: guide.category?.title || "Destination",
      image: imageUrl,
      votes: totalVotes,
      commentsCount,
      isPaid: guide.isPaid,
      price: guide.price,
    }
  })

  if (transformedGuides.length === 0) return null

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
              Trending
            </p>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Popular Guides
            </h2>
          </div>
          <Link
            href="/travel-guides"
            className="hidden items-center gap-1 text-sm font-semibold text-gray-500 transition-colors hover:text-black sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Masonry-like Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2 md:h-[600px]">
          {transformedGuides.map((guide, idx) => {
            const isLarge = idx === 0 && transformedGuides.length >= 3

            return (
              <Link
                key={guide.id}
                href={`/travel-guides/${guide.id}`}
                className={`group relative overflow-hidden rounded-3xl ${isLarge
                    ? "md:col-span-2 md:row-span-2 h-[400px] md:h-full"
                    : "h-[250px] md:h-auto"
                  }`}
              >
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    {guide.category}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold text-white ${guide.isPaid ? "bg-black/50 backdrop-blur-md" : "bg-emerald-500/80"
                      }`}
                  >
                    {guide.isPaid ? `$${guide.price}` : "Free"}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className={`font-bold text-white ${isLarge ? "text-2xl sm:text-3xl" : "text-lg"
                      }`}
                  >
                    {guide.title}
                  </h3>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70 transition-colors group-hover:text-white">
                      Read more →
                    </span>
                    <div className="flex gap-3 text-white/80">
                      <div className="flex items-center gap-1 text-xs">
                        <Heart className="h-3.5 w-3.5" />
                        <span>{guide.votes}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{guide.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/travel-guides"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500"
          >
            View all guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
