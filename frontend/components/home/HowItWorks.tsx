"use client"

import { Search, BookmarkPlus, MapPin, Share2, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    id: 1,
    title: "Browse Guides",
    description:
      "Explore travel guides created by experienced travelers and locals from around the world.",
    icon: <Search className="h-7 w-7" />,
  },
  {
    id: 2,
    title: "Save Your Favorites",
    description:
      "Bookmark guides to your collection for easy access whenever you plan your next adventure.",
    icon: <BookmarkPlus className="h-7 w-7" />,
  },
  {
    id: 3,
    title: "Plan Your Trip",
    description:
      "Use detailed itineraries, local tips, and hidden gems to craft the perfect travel experience.",
    icon: <MapPin className="h-7 w-7" />,
  },
  {
    id: 4,
    title: "Share & Connect",
    description:
      "Vote on helpful guides, leave comments, and connect with fellow travelers in our community.",
    icon: <Share2 className="h-7 w-7" />,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#f9f9f9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Start planning your perfect trip in just four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-black text-white shadow-md">
                {step.id}
              </div>

              {/* Icon */}
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 transition-colors group-hover:bg-black group-hover:text-white">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-[15px] font-bold text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-3xl bg-black p-10 md:p-14">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-3xl font-bold text-white">
                Ready to Start Exploring?
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-white/70">
                Join thousands of travelers discovering authentic experiences
                and hidden gems around the world.
              </p>

              <ul className="mb-8 space-y-3">
                {["Access thousands of guides", "Create and share your own guides", "Connect with fellow travelers"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                    <span className="text-sm text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/travel-guides"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  Explore Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Create Account
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="rounded-3xl bg-white/5 border border-white/10 p-8 text-center backdrop-blur-sm">
                <div className="mb-2 text-5xl font-black text-white">12K+</div>
                <p className="mb-6 text-sm font-semibold text-white/70">Active Travelers</p>
                <div className="space-y-3 text-left">
                  {[
                    { count: "5000+", label: "Travel Guides", color: "bg-blue-500" },
                    { count: "150+", label: "Destinations", color: "bg-emerald-500" },
                    { count: "24/7", label: "Community Support", color: "bg-violet-500" },
                  ].map(({ count, label, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${color}`} />
                      <span className="text-sm text-white/80">
                        <strong className="text-white">{count}</strong> {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
