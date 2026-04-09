import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Lock, ArrowRight, Calendar, Tag, Map, Clock, ShieldCheck } from "lucide-react"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import voteServices from "@/services/travelGuide/vote.service"
import commentServices from "@/services/travelGuide/comment.service"
import { getUserInfo } from "@/services/auth.service"
import VoteSection from "./VoteSection"
import CommentsSection from "./CommentsSection"

interface Props {
  id: string
}

type VoteStats = {
  voteCount: {
    upVotes: number
    downVotes: number
    totalScore?: number
  }
  userVote: {
    id: string
    voteType: "UP" | "DOWN"
  } | null
}

async function fetchGuideData(id: string) {
  const guideResponse = await travelGuideServices
    .getById(id)
    .catch((error) => {
      console.error("Error fetching guide:", error)
      return { success: false, data: null }
    })

  if (!guideResponse.success || !guideResponse.data) {
    return null
  }

  const guide = guideResponse.data

  let voteStats: VoteStats | null = null
  try {
    const voteStatsResponse = await voteServices.getVoteStats(id)
    if (voteStatsResponse.success && voteStatsResponse.data) {
      voteStats = voteStatsResponse.data as VoteStats
    }
  } catch (error) {
    console.error("Failed to fetch vote stats:", error)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let comments: any[] = []
  try {
    const commentsResponse = await commentServices.getComments(id)
    if (commentsResponse.success) {
      comments = commentsResponse.data ?? []
    }
  } catch (error) {
    console.error("Failed to fetch comments:", error)
  }

  let itinerary = [] as { day: number; title: string; activities?: string[] }[]
  try {
    itinerary = guide.itinerary ? JSON.parse(guide.itinerary ?? "[]") : []
  } catch (err) {
    itinerary = []
    console.warn("Failed to parse itinerary", err)
  }

  const currentUser = await getUserInfo()

  return { guide, voteStats, comments, itinerary, currentUserId: currentUser?.id }
}

export default async function GuideDetails({ id }: Props) {
  let data: Awaited<ReturnType<typeof fetchGuideData>>

  try {
    data = await fetchGuideData(id)
  } catch (error) {
    console.error("Error fetching guide details:", error)
    notFound()
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="rounded-3xl bg-white p-12 shadow-sm border border-gray-100">
          <Map className="mx-auto mb-6 h-12 w-12 text-gray-300" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Guide Not Found</h1>
          <p className="text-gray-500 max-w-sm">
            This travel guide doesn&apos;t exist or has been removed by the author.
          </p>
          <Link
            href="/travel-guides"
            className="mt-8 inline-flex items-center rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Browse All Guides
          </Link>
        </div>
      </div>
    )
  }

  const { guide, voteStats, comments, itinerary, currentUserId } = data
  const coverImage = guide.coverImage || "/assets/hero.jpg"

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Premium Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src={coverImage}
          alt={guide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90" />

        <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 md:p-12 md:pb-16 text-center">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex justify-center flex-wrap gap-2">
              {guide.category && (
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
                  {guide.category.title}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              {guide.title}
            </h1>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/80">
              {guide.member && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white backdrop-blur-md">
                    {guide.member.name.charAt(0)}
                  </div>
                  <span>By {guide.member.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>
                  {guide.createdAt
                    ? new Date(guide.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "Unknown"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Verified Itinerary</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Professional Layout */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">

          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Overview */}
            <section>
              <h2 className="mb-6 text-2xl font-black tracking-tight text-gray-900">
                Guide Overview
              </h2>
              <div className="prose prose-gray max-w-none text-[16px] leading-loose text-gray-600">
                {guide.description?.split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className={i !== 0 ? "mt-4" : ""}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">
                    Day-by-Day Itinerary
                  </h2>
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-600">
                    <Clock className="h-3.5 w-3.5" />
                    {itinerary.length} Days
                  </div>
                </div>

                <div className="relative space-y-8 pl-8 before:absolute before:bottom-2 before:left-3.5 before:top-4 before:w-[2px] before:bg-gray-100">
                  {itinerary.map((day, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[39px] top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-black text-[12px] font-black text-white shadow-sm">
                        {day.day || index + 1}
                      </div>

                      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                        <h3 className="text-lg font-bold text-gray-900">
                          {day.title}
                        </h3>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-4 space-y-3">
                            {day.activities.map((activity, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-[15px] leading-relaxed text-gray-600"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Discussion Section (Moved inside main column) */}
            {!guide.locked && (
              <>
                <hr className="border-gray-100 my-8" />
                <CommentsSection guideId={id} comments={comments} currentUserId={currentUserId} />
              </>
            )}
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">

              {/* Payment / Booking Card */}
              {guide.locked ? (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
                  <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
                    <Lock className="mx-auto mb-3 h-8 w-8 text-gray-400" />
                    <h3 className="font-bold text-gray-900">Premium Guide</h3>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-500 mb-6">
                      Unlock full access to the day-by-day itinerary, insider tips, and exact locations.
                    </p>
                    <div className="mb-8">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Price</span>
                      <p className="mt-1 text-4xl font-black text-gray-900">৳{guide.price}</p>
                    </div>
                    <Link
                      href={`/payment?guideId=${id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Unlock Now
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <Tag className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">Free Access</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      This comprehensive guide is available completely free to the community.
                    </p>
                    <button className="w-full rounded-full bg-emerald-500 py-4 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-colors hover:bg-emerald-600">
                      Save to Favorites
                    </button>
                  </div>
                </div>
              )}

              {/* Voting Section */}
              {!guide.locked && (
                <VoteSection guideId={id} voteStats={voteStats} />
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
