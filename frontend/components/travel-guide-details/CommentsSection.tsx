/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Send, MessageCircle } from "lucide-react"
import { createCommentAction } from "@/actions/travel-details/commentActions"
import CommentItem from "./CommentItem"

interface Comment {
  id: string
  guideId: string
  memberId: string
  parentId: string | null
  comment: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  member: {
    id: string
    name: string
    email: string
  }
  replies?: Comment[]
}

interface Props {
  guideId: string
  comments?: Comment[]
  currentUserId?: string
}

export default function CommentsSection({ guideId, comments, currentUserId }: Props) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const router = useRouter()

  const displayedComments = showAll ? comments : comments?.slice(0, 5)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const toastId = toast.loading("Posting comment...")

    setError(null)
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("guideId", guideId)
      formData.append("comment", newComment)

      const result = await createCommentAction(formData)

      if (result.success) {
        setNewComment("")
        toast.success("Comment added successfully!", { id: toastId })
        router.refresh()
      } else {
        setError(result.message || "Failed to add comment")
        toast.error(result.message || "Failed to add comment", { id: toastId })
      }
    } catch (_error: any) {
      setError("Failed to add comment. Please try again.")
      toast.error("Failed to add comment. Please try again.", { id: toastId })
      console.error("Comment error:", _error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-bold text-gray-900">
          Discussion ({comments?.length || 0})
        </h2>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
            You
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-0 transition-colors"
              rows={3}
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="h-3.5 w-3.5" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-1">
        {displayedComments && displayedComments.length > 0 ? (
          displayedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} guideId={guideId} currentUserId={currentUserId} />
          ))
        ) : (
          <div className="rounded-2xl bg-gray-50 py-8 text-center">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
            <p className="text-sm text-gray-500">
              No comments yet. Start the discussion!
            </p>
          </div>
        )}
        {comments && comments.length > 5 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-4 w-full rounded-full bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            Show all {comments.length} comments
          </button>
        )}
      </div>
    </div>
  )
}
