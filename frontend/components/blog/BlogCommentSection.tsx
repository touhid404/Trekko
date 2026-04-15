"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Send, MessageCircle, Edit2, Trash2, X, Check } from "lucide-react"
import { createBlogCommentAction, deleteBlogCommentAction, updateBlogCommentAction } from "@/actions/blog/blogActions"

interface BlogComment {
  id: string
  blogId: string
  memberId: string
  parentId: string | null
  comment: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  member: {
    id: string
    name: string
    email?: string
    profilePhoto?: string | null
  }
  replies?: BlogComment[]
}

interface Props {
  blogId: string
  comments?: BlogComment[]
  currentUserId?: string
}

export default function BlogCommentSection({ blogId, comments, currentUserId }: Props) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const displayedComments = showAll ? comments : comments?.slice(0, 3)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!currentUserId) {
      toast.error("Please log in to comment")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("blogId", blogId)
      formData.append("comment", newComment)

      const result = await createBlogCommentAction(formData)

      if (result.success) {
        setNewComment("")
        toast.success("Comment posted!")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to post comment")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return

    try {
      const result = await deleteBlogCommentAction(commentId)
      if (result.success) {
        toast.success("Comment deleted")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to delete")
      }
    } catch {
      toast.error("Something went wrong")
    }
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editValue.trim()) return

    setIsUpdating(true)
    try {
      const result = await updateBlogCommentAction(commentId, editValue)
      if (result.success) {
        setEditingCommentId(null)
        toast.success("Comment updated")
        router.refresh()
      } else {
        toast.error(result.message || "Failed to update")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="border-t border-gray-100 px-5 pb-5 pt-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
          You
        </div>
        <div className="flex flex-1 items-center gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:bg-gray-100 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="rounded-full bg-black p-2.5 text-white transition-transform hover:scale-110 disabled:opacity-30 disabled:hover:scale-100"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>

      {/* Comment List */}
      {displayedComments && displayedComments.length > 0 ? (
        <div className="space-y-3">
          {displayedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-bold text-gray-500">
                {comment.member?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="group relative rounded-2xl bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-gray-900">
                      {comment.member?.name || "Unknown"}
                    </p>
                    {currentUserId === comment.memberId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id)
                            setEditValue(comment.comment)
                          }}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-indigo-600"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-indigo-300 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isUpdating}
                        className="rounded-full bg-black p-1.5 text-white disabled:opacity-30"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="rounded-full bg-gray-200 p-1.5 text-gray-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {comment.comment}
                    </p>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-4 px-2">
                  <span className="text-[11px] text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-2.5">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[9px] font-bold text-gray-500">
                          {reply.member?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div className="rounded-xl bg-gray-50 px-3 py-2">
                          <p className="text-[12px] font-bold text-gray-900">
                            {reply.member?.name || "Unknown"}
                          </p>
                          <p className="text-[13px] text-gray-600">{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
          <MessageCircle className="h-4 w-4" />
          <span>No comments yet</span>
        </div>
      )}

      {comments && comments.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 w-full text-center text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700"
        >
          View all {comments.length} comments
        </button>
      )}
    </div>
  )
}
