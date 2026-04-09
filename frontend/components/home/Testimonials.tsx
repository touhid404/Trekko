"use client"

import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Adventure Blogger",
      text: "Trekko completely changed how I plan trips. The community guides are incredibly detailed and the itineraries saved me hours of research.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=sarah",
    },
    {
      id: 2,
      name: "Rafiq Ahmed",
      role: "Local Guide",
      text: "Finally a platform that lets me share my local knowledge. My Cox's Bazar guide has helped hundreds of travelers discover hidden spots.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=rafiq",
    },
    {
      id: 3,
      name: "James Park",
      role: "Budget Traveler",
      text: "The budget travel guides here are gold. I backpacked Southeast Asia following Trekko guides and spent way less than expected.",
      rating: 4,
      avatar: "https://i.pravatar.cc/150?u=james",
    },
  ]

  return (
    <section className="py-20 bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
            Reviews
          </p>
          <h2 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            What Travelers Say
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-8 w-8 text-gray-200" />

              {/* Review text */}
              <p className="mb-6 text-[15px] leading-relaxed text-gray-600">
                &quot;{t.text}&quot;
              </p>

              {/* Rating */}
              <div className="mb-5 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-100 text-gray-100"
                      }`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
