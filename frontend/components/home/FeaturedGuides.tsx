/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
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

  const displayGuides = transformedGuides.slice(0, 4)

  if (displayGuides.length === 0) return null

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Discover the Best Travel<br />Guides of the Month
          </h2>
          <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">
            Explore our travel guides for every traveler. Whether a beach getaway, mountain trek, or city exploration, we have something special!
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayGuides.slice(0, 4).map((guide) => (
            <div key={guide.id} className="group relative flex flex-col bg-transparent">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl w-full">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col py-4 px-1 gap-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{guide.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  A comprehensive travel guide designed to explore the gems and attractions.
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold text-gray-900 text-sm">
                    {guide.isPaid ? `$${guide.price}` : "Free"}
                  </span>
                  <Link
                    href={`/travel-guides/${guide.id}`}
                    className="flex items-center gap-1 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    Details <span className="ml-1">›</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
