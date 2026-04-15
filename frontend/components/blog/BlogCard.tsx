"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Trash2, MoreHorizontal, PenLine } from "lucide-react"
import { toast } from "sonner"
import { toggleBlogLikeAction, deleteBlogAction, updateBlogAction } from "@/actions/blog/blogActions"
import { useRouter } from "next/navigation"
import BlogCommentSection from "./BlogCommentSection"

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
  blog: {
    id: string
    authorId: string
    title: string
    content: string
    coverImage?: string | null
    createdAt: string
    author: {
      id: string
      name: string
      profilePhoto?: string | null
    }
    isLikedByMe?: boolean
    _count: {
      likes: number
      comments: number
    }
  }
  comments?: BlogComment[]
  currentUserId?: string
}

export default function BlogCard({ blog, comments, currentUserId }: Props) {
  const [liked, setLiked] = useState(blog.isLikedByMe || false)
  const [likeCount, setLikeCount] = useState(blog._count.likes)
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(blog.title)
  const [editContent, setEditContent] = useState(blog.content)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const isOwner = currentUserId === blog.authorId

  const handleLike = async () => {
    if (!currentUserId) {
      toast.error("Please log in to like posts")
      return
    }

    setIsLiking(true)
    // Optimistic update
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))

    try {
      const result = await toggleBlogLikeAction(blog.id)
      if (result.success && result.data) {
        setLiked(result.data.liked)
        setLikeCount(result.data.likeCount)
      } else {
        // Revert
        setLiked(liked)
        setLikeCount(blog._count.likes)
        toast.error("Failed to toggle like")
      }
    } catch {
      setLiked(liked)
      setLikeCount(blog._count.likes)
    } finally {
      setIsLiking(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?")
    if (!confirmed) return

    const toastId = toast.loading("Deleting post...")
    try {
      const result = await deleteBlogAction(blog.id)
      if (result.success) {
        toast.success("Post deleted", { id: toastId })
        router.refresh()
      } else {
        toast.error(result.message || "Failed to delete", { id: toastId })
      }
    } catch {
      toast.error("Something went wrong", { id: toastId })
    }
  }

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content are required")
      return
    }

    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append("title", editTitle)
      formData.append("content", editContent)

      const result = await updateBlogAction(blog.id, formData)
      if (result.success) {
        setIsEditing(false)
        router.refresh()
        toast.success("Post updated!")
      } else {
        toast.error(result.message || "Failed to update")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <article className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-600 text-sm font-bold text-white shadow-sm">
            {blog.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-900">{blog.author.name}</p>
            <p className="text-[12px] text-gray-400">{timeAgo(blog.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                <button
                  onClick={() => { setShowMenu(false); setIsEditing(true) }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <PenLine className="h-4 w-4" />
                  Edit Post
                </button>
                <button
                  onClick={() => { setShowMenu(false); handleDelete() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        {isEditing ? (
          <div className="space-y-3 py-2">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[17px] font-black tracking-tight text-gray-900 focus:border-indigo-300 focus:outline-none"
              placeholder="Title..."
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[120px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-[15px] leading-relaxed text-gray-700 focus:border-indigo-300 focus:outline-none"
              placeholder="Content..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditTitle(blog.title)
                  setEditContent(blog.content)
                }}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="mb-2 text-[17px] font-black tracking-tight text-gray-900">
              {blog.title}
            </h2>
            <p className="text-[15px] leading-relaxed text-gray-600 whitespace-pre-line">
              {blog.content}
            </p>
          </>
        )}
      </div>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="relative mt-2 aspect-video w-full overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Stats Row */}
      {(likeCount > 0 || blog._count.comments > 0) && (
        <div className="flex items-center justify-between px-5 py-2.5 text-[13px] text-gray-400">
          <div className="flex items-center gap-1.5">
            {likeCount > 0 && (
              <>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  ♥
                </span>
                <span>{likeCount}</span>
              </>
            )}
          </div>
          {blog._count.comments > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline"
            >
              {blog._count.comments} comment{blog._count.comments !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${liked
              ? "text-red-500"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
        >
          <Heart
            className={`h-[18px] w-[18px] transition-transform ${liked ? "fill-red-500 scale-110" : ""}`}
          />
          {liked ? "Liked" : "Like"}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-1 items-center justify-center gap-2 border-l border-gray-100 py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <MessageCircle className="h-[18px] w-[18px]" />
          Comment
        </button>
      </div>

      {/* Inline Comments */}
      {showComments && (
        <BlogCommentSection
          blogId={blog.id}
          comments={comments}
          currentUserId={currentUserId}
        />
      )}
    </article>
  )
}
