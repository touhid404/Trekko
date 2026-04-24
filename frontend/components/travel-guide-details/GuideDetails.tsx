import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Lock, ArrowRight, Calendar, Map, Clock, ShieldCheck } from "lucide-react"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import voteServices from "@/services/travelGuide/vote.service"
import commentServices from "@/services/travelGuide/comment.service"
import { getUserInfo } from "@/services/auth.service"
import VoteSection from "./VoteSection"
import CommentsSection from "./CommentsSection"
import CheckpointProgressTracker from "./CheckpointProgressTracker"

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
    <div className="min-h-screen bg-[#FAFAFA] pb-32 font-sans selection:bg-emerald-500/30">
      {/* Immersive Full-Bleed Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] w-full">
        <Image
          src={coverImage}
          alt={guide.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        <div className="absolute bottom-16 left-0 right-0 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl p-6 md:p-8 rounded-[2rem] bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg">
              <div className="mb-6 flex flex-wrap gap-3">
                {guide.category && (
                  <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase text-white shadow-sm backdrop-blur-md border border-white/20">
                    {guide.category.title}
                  </span>
                )}
                {guide.locked && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase text-black shadow-md">
                    <Lock className="h-3 w-3" />
                    Premium Content
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl mb-6 leading-tight">
                {guide.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-white/90">
                {guide.member && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-bold backdrop-blur-md border border-white/20">
                      {guide.member.name.charAt(0)}
                    </div>
                    <span className="text-base text-white">{guide.member.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 opacity-70" />
                  <span>{guide.createdAt ? new Date(guide.createdAt).getFullYear() : "Archived"}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-emerald-400/20">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping Glass Layout */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">

          {/* Main Content (Left Column) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Overview */}
            <section className="rounded-3xl bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                 <Map className="w-48 h-48 -mt-10 -mr-10 rotate-12" />
              </div>
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
                Overview
              </h2>
              <div className="text-gray-600 text-base leading-relaxed space-y-4 relative z-10">
                {guide.description?.split('\n').map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section className="rounded-3xl bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Itinerary
                  </h2>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600 uppercase tracking-widest">
                    <Clock className="h-4 w-4" />
                    {itinerary.length} Days
                  </div>
                </div>

                <div className="relative space-y-8 before:absolute before:inset-y-0 before:left-6 before:w-px before:bg-gray-200">
                  {itinerary.map((day, index) => (
                    <div key={index} className="group relative flex items-start gap-6">
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-base font-bold text-white shadow-lg ring-4 ring-white transition-transform duration-500 group-hover:scale-110 group-hover:bg-emerald-500">
                        {day.day || index + 1}
                      </div>

                      <div className="flex-1 rounded-[1.5rem] bg-gray-50/50 p-6 shadow-sm transition-all duration-500 hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 border border-transparent hover:border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
                          {day.title}
                        </h3>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="space-y-3">
                            {day.activities.map((activity, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm text-gray-600 font-medium"
                              >
                                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/40" />
                                <span className="leading-relaxed">{activity}</span>
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

            {/* Discussion Section */}
            {!guide.locked && (
              <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                 <CommentsSection guideId={id} comments={comments} currentUserId={currentUserId} />
              </div>
            )}
          </div>

          {/* Sticky Sidebar (Right Column) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-6">

              {/* Payment / Booking Card */}
              {guide.locked && (
                <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-gray-100 transition-transform duration-500 hover:-translate-y-1">
                  <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] rounded-full" />
                    <Lock className="mx-auto mb-4 h-8 w-8 text-emerald-400" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-white">Premium Access</h3>
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
                      Unlock the complete high-fidelity itinerary and verified expedition coordinates.
                    </p>
                    <div className="mb-8">
                      <p className="text-4xl font-black tracking-tight text-gray-900">৳{guide.price}</p>
                      <span className="text-[10px] font-bold text-gray-400 mt-2 block uppercase tracking-[0.1em]">One-Time Payment</span>
                    </div>
                    <Link
                      href={`/payment?guideId=${id}`}
                      className="flex w-full items-center justify-center h-12 rounded-full bg-black text-sm font-bold tracking-widest uppercase text-white transition-all hover:bg-emerald-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] active:scale-95"
                    >
                      Acquire Access <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ) }

              {/* Interactive Explorer Checklist */}
              {!guide.locked && guide.checkpoints && guide.checkpoints.length > 0 && (
                <div className="rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                  <CheckpointProgressTracker 
                    guideId={id} 
                    checkpoints={guide.checkpoints} 
                  />
                </div>
              )}
              
              {/* Voting Section */}
              {!guide.locked && (
                <div className="rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                  <VoteSection guideId={id} voteStats={voteStats} />
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
