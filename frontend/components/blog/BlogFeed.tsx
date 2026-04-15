"use client"

import { BookOpen } from "lucide-react"
import CreateBlogForm from "./CreateBlogForm"
import BlogCard from "./BlogCard"

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

interface BlogWithComments {
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
  comments: BlogComment[]
}

interface Props {
  blogsWithComments: BlogWithComments[]
  currentUserId?: string
  userName?: string
}

export default function BlogFeed({ blogsWithComments, currentUserId, userName }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Create Post (if logged in) */}
      {currentUserId && (
        <div className="mb-6">
          <CreateBlogForm userName={userName} />
        </div>
      )}

      {/* Blog Feed */}
      {blogsWithComments.length > 0 ? (
        <div className="space-y-5">
          {blogsWithComments.map(({ blog, comments }) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              comments={comments}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-bold text-gray-900">No posts yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            {currentUserId
              ? "Be the first to share your travel story!"
              : "Log in to create the first post!"}
          </p>
        </div>
      )}
    </div>
  )
}
