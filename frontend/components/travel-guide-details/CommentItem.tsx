/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"
import { Reply, Pencil, Trash2 } from "lucide-react"
import {
  updateCommentAction,
  deleteCommentAction,
  createCommentAction,
} from "@/actions/travel-details/commentActions"

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
  comment: Comment
  guideId: string
  currentUserId?: string
}

export default function CommentItem({ comment, guideId, currentUserId }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.comment)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const initials = comment.member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isOwner = currentUserId === comment.memberId

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating comment...")
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("commentId", comment.id)
      formData.append("comment", editText)

      const result = await updateCommentAction(formData)
      if (result.success) {
        setIsEditing(false)
        toast.success("Comment updated!", { id: toastId })
        router.refresh()
      } else {
        toast.error(result.message || "Failed to update", { id: toastId })
      }
    } catch (_error: any) {
      toast.error("Failed to update. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const result = await swal({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    if (!result) return

    const toastId = toast.loading("Deleting...")
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("commentId", comment.id)

      const res = await deleteCommentAction(formData)
      if (res.success) {
        toast.success("Comment deleted!", { id: toastId })
        router.refresh()
      } else {
        toast.error(res.message || "Failed to delete", { id: toastId })
      }
    } catch (_error: any) {
      toast.error("Failed to delete. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) return
    const toastId = toast.loading("Posting reply...")
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("guideId", guideId)
      formData.append("comment", replyText)
      formData.append("parentId", comment.id)

      const result = await createCommentAction(formData)
      if (result.success) {
        setReplyText("")
        setIsReplying(false)
        toast.success("Reply added!", { id: toastId })
        router.refresh()
      } else {
        toast.error(result.message || "Failed to reply", { id: toastId })
      }
    } catch (_error: any) {
      toast.error("Failed to reply. Please try again.", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="py-4">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">
              {comment.member.name}
            </span>
            <span className="text-xs text-gray-400">
              {comment.createdAt ? timeAgo(comment.createdAt) : ""}
            </span>
          </div>

          {/* Body */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-gray-300 focus:bg-white focus:outline-none"
                rows={2}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting}
                  className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-600">{comment.comment}</p>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="mt-2 flex items-center gap-1">
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <Reply className="h-3 w-3" />
                Reply
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </>
              )}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-gray-300 focus:bg-white focus:outline-none"
              />
              <button
                onClick={handleReply}
                disabled={isSubmitting || !replyText.trim()}
                className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
              >
                Reply
              </button>
              <button
                onClick={() => setIsReplying(false)}
                className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 border-l-2 border-gray-100 pl-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  guideId={guideId}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
