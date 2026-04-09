import { Heart, MessageCircle } from "lucide-react"
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
    <Link href={`/travel-guides/${guide.id}`} className="group block">
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-52 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={guide.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {guide.category && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                {guide.category.title}
              </span>
            )}
          </div>

          {guide.isPaid && (
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-black px-3 py-1 text-[11px] font-bold text-white">
                {guide.price ? `$${guide.price}` : "Premium"}
              </span>
            </div>
          )}

          {!guide.isPaid && (
            <div className="absolute top-4 right-4">
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white">
                Free
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="mb-1.5 text-[15px] font-bold text-gray-900 line-clamp-1 group-hover:text-black">
            {guide.title}
          </h3>

          <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-2">
            {guide.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart className="h-3.5 w-3.5" />
                <span>{guide.votes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MessageCircle className="h-3.5 w-3.5" />
                <span>{commentCount}</span>
              </div>
            </div>

            <span className="text-xs font-semibold text-gray-400 group-hover:text-black transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
