import Link from "next/link"
import { Search, MapPin, Star } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] w-full flex-col overflow-hidden bg-[#0A0A0A]">
      {/* Background Image (Epic unsplash landscape) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000')",
        }}
      />
      {/* sophisticated dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Text Content */}
          <div className="max-w-2xl pt-20 lg:pt-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                Premium Travel Experience
              </span>
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Redefine Your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Boundaries.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/60">
              Access the world&apos;s most expertly crafted itineraries. Escape the tourist traps and discover authentic experiences curated by locals and seasoned explorers.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/travel-guides"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-gray-100 active:scale-95"
              >
                <Search className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                Find Your Journey
              </Link>
              <Link
                href="/about-us"
                className="inline-flex items-center rounded-full border border-white/20 bg-transparent px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
              >
                How it works
              </Link>
            </div>
          </div>

          {/* Right Featured Card (Hidden on small screens) */}
          <div className="hidden lg:flex justify-end">
            <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-transform hover:-translate-y-2">
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 font-semibold text-white text-[10px] backdrop-blur-md uppercase tracking-wider">
                  Featured
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-1 text-emerald-400 mb-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cox&apos;s Bazar</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">The Ultimate Coastal Guide</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-white">4.9</span>
                  <span className="text-xs text-white/50">(128 reviews)</span>
                </div>
                <Link href="/travel-guides" className="text-xs font-bold text-white/80 hover:text-white transition-colors">
                  Explore →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Bar matching the dark theme */}
      <div className="relative z-10 mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md py-6">
        <div className="mx-auto flex w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            <div className="text-center">
              <h3 className="text-2xl font-black text-white sm:text-3xl">10+</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/40">Exclusive Guides</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white sm:text-3xl">8</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/40">Categories</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white sm:text-3xl">4.9</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/40">Average Rating</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-white sm:text-3xl">100%</h3>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-white/40">Authentic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
