import { BookOpen, Calendar, User } from "lucide-react"

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Hidden Gems in Southeast Asia",
      excerpt:
        "Discover lesser-known destinations that offer authentic cultural experiences and breathtaking natural beauty.",
      date: "March 15, 2024",
      author: "Sarah Chen",
      category: "Destinations",
    },
    {
      id: 2,
      title: "Sustainable Travel: Making a Positive Impact",
      excerpt:
        "Learn how to travel responsibly while minimizing your environmental footprint and supporting local communities.",
      date: "March 10, 2024",
      author: "Mike Rodriguez",
      category: "Travel Tips",
    },
    {
      id: 3,
      title: "A Foodie&apos;s Guide to Street Markets in Europe",
      excerpt:
        "Explore the vibrant street food scenes across European cities. From Barcelona to Istanbul, discover the best local flavors.",
      date: "March 5, 2024",
      author: "Emma Thompson",
      category: "Food & Culture",
    },
    {
      id: 4,
      title: "Adventure Travel: Conquering the Inca Trail",
      excerpt:
        "A comprehensive guide to hiking the legendary Inca Trail to Machu Picchu. Preparation tips and what to expect.",
      date: "February 28, 2024",
      author: "David Kim",
      category: "Adventure",
    },
    {
      id: 5,
      title: "Budget Travel Hacks for Long-Term Trips",
      excerpt:
        "Maximize your travel budget with proven strategies. From house sitting to work exchanges, extend your adventures.",
      date: "February 20, 2024",
      author: "Lisa Park",
      category: "Budget Travel",
    },
    {
      id: 6,
      title: "Photography Tips for Travel Enthusiasts",
      excerpt:
        "Capture stunning travel photos with professional techniques. Learn about composition, lighting, and editing.",
      date: "February 15, 2024",
      author: "Alex Johnson",
      category: "Photography",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-black py-20 text-center text-white">
        <div className="absolute inset-0 bg-[url('/assets/hero.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Travel Blog
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-lg mx-auto">
            Latest stories, insights, and travel inspiration from our community
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div className="mb-4">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600">
                  {post.category}
                </span>
              </div>

              <h2 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-black line-clamp-2">
                {post.title}
              </h2>

              <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
