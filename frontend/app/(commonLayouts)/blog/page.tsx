import { BookOpen } from "lucide-react"
import blogService from "@/services/blog/blog.service"
import { getUserInfo } from "@/services/auth.service"
import BlogFeed from "@/components/blog/BlogFeed"

export default async function BlogPage() {
  const [blogsResponse, currentUser] = await Promise.all([
    blogService.getAll(1, 20),
    getUserInfo().catch(() => null),
  ])

  const blogs = blogsResponse.data || []

  // Fetch comments for each blog
  const blogsWithComments = await Promise.all(
    blogs.map(async (blog) => {
      const commentsRes = await blogService.getComments(blog.id)
      return {
        blog,
        comments: commentsRes.data || [],
      }
    })
  )

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-slate-950 py-24 text-center text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-50" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Travel Blog
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-lg mx-auto">
            Share your stories, tips, and travel experiences with the community
          </p>
        </div>
      </div>

      {/* Feed */}
      <BlogFeed
        blogsWithComments={blogsWithComments}
        currentUserId={currentUser?.id}
        userName={currentUser?.name}
      />
    </div>
  )
}
