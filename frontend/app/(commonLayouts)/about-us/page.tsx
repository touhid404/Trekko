import { Globe, BookOpen, MapPin, Users, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-black py-24 text-center text-white">
        <div className="absolute inset-0 bg-[url('/assets/hero.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Globe className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            About Trekko
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-lg mx-auto">
            Your online community portal for sharing travel guides, destination tips, itineraries, and travel experiences.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Mission */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="text-[15px] leading-relaxed text-gray-600">
              We believe in empowering travelers with real stories and
              high-quality guides. Our mission is to build a trusted platform
              where every trip plan is enriched by community expertise and
              admin-verified quality.
            </p>
          </div>

          {/* What We Offer */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              What We Offer
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { icon: BookOpen, title: "Community Travel Guides", desc: "Browse rich, curated guides from fellow travelers across the globe." },
                { icon: MapPin, title: "Destination Insights", desc: "Get local tips, must-see locations, and up-to-date travel info." },
                { icon: Users, title: "Trip Itineraries", desc: "Use ready-made itineraries or make your own with actionable steps." },
                { icon: Shield, title: "Admin-Verified Quality", desc: "All guides are reviewed and moderated to ensure accuracy and trust." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-[#f9f9f9] p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              How It Works
            </h2>
            <div className="relative space-y-6 pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
              {[
                "Share your guide, itinerary, or travel story in a simple form.",
                "Admins review and give feedback to maintain high quality and accuracy.",
                "Approved guides are published for everyone to use and enjoy.",
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                    {i + 1}
                  </div>
                  <p className="text-[15px] text-gray-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-3xl bg-black p-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">
              Ready to join the adventure?
            </h2>
            <p className="mb-6 text-sm text-white/60">
              Start contributing or explore guides in the community now.
            </p>
            <Link
              href="/travel-guides"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105"
            >
              Browse Travel Guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
