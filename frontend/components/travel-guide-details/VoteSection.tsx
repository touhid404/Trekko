"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { toast } from "sonner"
import { castVoteAction } from "@/actions/travel-details/castVoteAction"

interface VoteStats {
  voteCount: {
    upVotes: number
    downVotes: number
    totalScore?: number
  }
  userVote?: {
    id: string
    voteType: "UP" | "DOWN"
  } | null
  userVoteScore?: number
}

interface Props {
  guideId: string
  voteStats: VoteStats | null
}

export default function VoteSection({ guideId, voteStats }: Props) {
  const [isVoting, setIsVoting] = useState(false)
  const [currentStats, setCurrentStats] = useState<VoteStats | null>(voteStats)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async (voteType: "UP" | "DOWN") => {
    const toastId = toast.loading("Casting vote...")
    setError(null)
    setIsVoting(true)
    try {
      const formData = new FormData()
      formData.append("guideId", guideId)
      formData.append("voteType", voteType)

      const result = await castVoteAction(formData)

      if (result.success && result.data) {
        setCurrentStats(result.data as VoteStats)
        toast.success("Vote cast successfully!", { id: toastId })
      } else {
        setError(result.message || "Failed to cast vote")
        toast.error(result.message || "Failed to cast vote", { id: toastId })
      }
    } catch (error: any) {
      setError("Failed to cast vote. Please try again.")
      toast.error("Failed to cast vote. Please try again.", { id: toastId })
      console.error("Vote error:", error)
    } finally {
      setIsVoting(false)
    }
  }

  if (!currentStats) return null

  const { voteCount, userVote } = currentStats

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-gray-900">Rate This Guide</h2>
      <p className="mb-6 text-sm text-gray-500">
        Let the author know if this guide was helpful
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleVote("UP")}
          disabled={isVoting}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${userVote?.voteType === "UP"
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          <ThumbsUp className="h-4 w-4" />
          Helpful ({voteCount.upVotes})
        </button>
        <button
          onClick={() => handleVote("DOWN")}
          disabled={isVoting}
          className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${userVote?.voteType === "DOWN"
              ? "bg-red-500 text-white shadow-md shadow-red-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          <ThumbsDown className="h-4 w-4" />
          Not helpful ({voteCount.downVotes})
        </button>
        {userVote && (
          <button
            onClick={() => handleVote(userVote.voteType)}
            disabled={isVoting}
            className="rounded-full px-5 py-3 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600"
          >
            Remove vote
          </button>
        )}
      </div>
    </div>
  )
}
