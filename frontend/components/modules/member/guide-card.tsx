import { cn } from "@/lib/utils"
import { Heart, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

interface GuideCardProps {
  guide: {
    id: string
    title: string
    description: string
    coverImage: string
    isPaid: boolean
    price?: number
    category?: { title: string; slug: string }
    guideMedia?: Array<{ url: string; type: string }>
    votes?: Array<{ type: "UPVOTE" | "DOWNVOTE" | "UP" | "DOWN" }>
    comments?: Array<{ id: string; isDeleted?: boolean }>
    createdAt: string
  }
  authorName?: string
}

export function GuideCard({ guide }: GuideCardProps) {
  const commentCount =
    guide.comments?.filter((com) => !com.isDeleted).length || 0

  const imageUrl = guide.coverImage || guide.guideMedia?.[0]?.url || "/assets/hero.jpg"

  return (
    <Link href={`/travel-guides/${guide.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-[2rem] bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        {/* Image Section */}
        <div className="relative mb-4 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={guide.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {guide.category && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-900 shadow-sm backdrop-blur-sm">
                {guide.category.title}
              </span>
            )}
          </div>

          <div className="absolute right-4 top-4 flex flex-wrap gap-2">
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md",
              guide.isPaid ? "bg-black/60" : "bg-emerald-500/80"
            )}>
              {guide.isPaid ? (guide.price ? `৳${guide.price}` : "Premium") : "Free"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-2">
          <h3 className="mb-2 text-lg font-bold tracking-tight text-gray-900 line-clamp-1">
            {guide.title}
          </h3>

          <p className="mb-4 text-sm text-gray-500 line-clamp-2 flex-1 leading-relaxed">
            {guide.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Heart className="h-4 w-4" />
                <span>{guide.votes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <MessageCircle className="h-4 w-4" />
                <span>{commentCount}</span>
              </div>
            </div>

            <span className="flex items-center gap-1 text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              Details <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
