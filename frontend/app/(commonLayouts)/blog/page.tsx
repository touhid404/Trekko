/* eslint-disable @typescript-eslint/no-explicit-any */
import blogService from "@/services/blog/blog.service"
import { getUserInfo } from "@/services/auth.service"
import BlogFeed from "@/components/blog/BlogFeed"

export default async function BlogPage() {
  const [blogsResponse, currentUser] = await Promise.all([
    blogService.getAll(1, 20),
    getUserInfo().catch(() => null),
  ])

  const blogs = blogsResponse.data || []
  const blogsData = blogs.map((blog: any) => ({
    blog,
    comments: [], // Comments will be fetched lazily in BlogCard
  }))

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-10">
      {/* Feed */}
      <BlogFeed
        blogsWithComments={blogsData}
        currentUserId={currentUser?.id}
        userName={currentUser?.name}
      />
    </div>
  )
}
