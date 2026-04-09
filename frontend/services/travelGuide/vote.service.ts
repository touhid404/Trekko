import { refreshCookie } from "@/lib/axios/refreshCookie"
import { IResponse } from "@/types/api.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface VoteCount {
  upVotes: number
  downVotes: number
  totalScore?: number
}

interface Vote {
  id: string
  memberId: string
  guideId: string
  voteType: "UP" | "DOWN"
  createdAt: string
  updatedAt: string
}

interface CastVotePayload {
  guideId: string
  voteType: "UP" | "DOWN"
}

interface CastVoteResponse {
  vote: Vote | null
  voteCount: {
    upVotes: number
    downVotes: number
  }
  userVoteScore: number
}

interface GetVoteStatsResponse {
  voteCount: VoteCount
  userVote: Vote | null
}

const voteServices = {
  castVote: async (
    payload: CastVotePayload
  ): Promise<IResponse<CastVoteResponse>> => {
    const cookieHeader = await refreshCookie()

    const response = await fetch(`${API_BASE_URL}/votes/cast-vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to cast vote: ${response.statusText}`)
    }

    return response.json()
  },

  getVoteStats: async (
    guideId: string
  ): Promise<IResponse<GetVoteStatsResponse>> => {
    try {
      const cookieHeader = await refreshCookie()

      const response = await fetch(`${API_BASE_URL}/votes/stats/${guideId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
      })

      // Handle 404 or other errors gracefully
      if (!response.ok) {
        return {
          success: true,
          message: "Vote stats unavailable",
          data: {
            voteCount: { upVotes: 0, downVotes: 0, totalScore: 0 },
            userVote: null,
          },
        }
      }

      return response.json()
    } catch (error: any) {
      console.error("Error fetching vote stats:", error)
      // Return default stats on error
      return {
        success: true,
        message: "Vote stats unavailable",
        data: {
          voteCount: { upVotes: 0, downVotes: 0, totalScore: 0 },
          userVote: null,
        },
      }
    }
  },
}

export default voteServices
