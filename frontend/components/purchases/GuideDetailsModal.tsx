"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, User, Tag, Clock, MapPin, Globe, Compass, ShieldCheck } from "lucide-react"

interface Guide {
  id: string
  title: string
  description?: string
  itinerary?: string
  category: {
    title: string
  }
  price: number
  coverImage?: string
  createdAt: string
  member?: {
    name: string
    image?: string
  }
}

interface GuideDetailsModalProps {
  guide: Guide
}

export function GuideDetailsModal({ guide }: GuideDetailsModalProps) {
  const itinerary = guide.itinerary ? JSON.parse(guide.itinerary) : []

  return (
    <div className="bg-[#050505] text-white selection:bg-blue-400 selection:text-white">
      {/* Hero Section with Immersive Overlay */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        {guide.coverImage ? (
          <img
            src={guide.coverImage}
            alt={guide.title}
            className="h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <Compass className="h-20 w-20 text-white/10 animate-pulse" />
          </div>
        )}

        {/* Thematic Overlays */}
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/40 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-[#050505]/80 via-transparent to-transparent" />

        {/* "Passport" Branding */}
        <div className="absolute top-8 left-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10">
            <Globe className="h-6 w-6 text-blue-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Traveler Manifest</p>
            <p className="text-xs font-bold text-white/80">ENTRY- {guide.id.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 right-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-blue-400 backdrop-blur-xl border border-blue-500/20">
              <Tag className="h-3 w-3" />
              {guide.category.title}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black tracking-widest uppercase text-emerald-400 backdrop-blur-xl border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" />
              Verified Itinerary
            </div>
          </div>
          <h2 className="mt-6 text-5xl font-black tracking-tighter leading-[0.9] sm:text-6xl max-w-2xl">
            {guide.title}
          </h2>
        </div>
      </div>

      <div className="p-10 space-y-20">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:gap-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <User className="h-3.5 w-3.5" />
              Curator
            </div>
            <p className="font-bold text-sm tracking-tight">{guide.member?.name || "Global Explorer"}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <Calendar className="h-3.5 w-3.5" />
              Logged
            </div>
            <p className="font-bold text-sm tracking-tight">
              {new Date(guide.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <Globe className="h-3.5 w-3.5" />
              Region
            </div>
            <p className="font-bold text-sm tracking-tight">{guide.category.title} Specialist</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
              <Clock className="h-3.5 w-3.5" />
              Plan
            </div>
            <p className="font-bold text-sm tracking-tight">{itinerary.length} Day Expedition</p>
          </div>
        </div>

        {/* Description Section */}
        {guide.description && (
          <section className="relative space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              Expedition Overview
            </h3>
            <div className="absolute -left-10 top-0 h-full w-1 bg-linear-to-b from-blue-500/40 via-blue-500/10 to-transparent rounded-full" />
            <p className="text-xl leading-relaxed text-white/60 font-light max-w-3xl">
              {guide.description}
            </p>
          </section>
        )}

        {/* Itinerary Section */}
        {itinerary.length > 0 && (
          <section className="space-y-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
              The Manifest
            </h3>

            <div className="relative space-y-16 pl-8">
              {/* Vertical Line with Dynamic Gradient */}
              <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-linear-to-b from-blue-500/30 via-white/5 to-transparent" />

              {itinerary.map((day: any, index: number) => (
                <div key={index} className="relative group">
                  {/* Node Dot with Glow */}
                  <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full border-2 border-white/10 bg-black transition-all duration-500 group-hover:scale-125 group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]" />

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[10px] font-black text-white/40 border border-white/5">
                        {index + 1}
                      </span>
                      <h4 className="text-2xl font-black tracking-tight text-white/90">
                        {day.title}
                      </h4>
                    </div>

                    {day.activities && day.activities.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {day.activities.map((activity: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4 rounded-3xl border border-white/5 bg-white/[0.03] p-5 transition-all duration-500 hover:bg-white/5 hover:border-white/10 hover:translate-x-1">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                              <Clock className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold tracking-wide text-white/60">{activity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Branding */}
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
          <div className="flex items-center gap-4">
            <Compass className="h-8 w-8 text-white/20" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Trekko Premium Collection</p>
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-white/40">Verified exploration journal &copy; 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Globe className="h-5 w-5 text-white/20" />
            <div className="h-8 w-1 bg-white/5 rounded-full" />
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              TRANS-ALPHA-LOG
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
