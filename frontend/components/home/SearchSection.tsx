"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

export default function SearchSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const [activeTab, setActiveTab] = useState("Travel")
  const tabs = ["Travel", "Hotel", "Flight", "Destination"]
  const filters = ["Bali Indonesia", "Nusa Penida", "Kuta Bali", "Sanur Bali"]

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim())
    }
    const queryString = params.toString()
    router.push(`/travel-guides${queryString ? `?${queryString}` : ""}`)
  }

  return (
    <section className="relative z-20 -mt-16 mb-16 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="rounded-t-2xl bg-white/90 backdrop-blur-md inline-flex p-2 gap-2 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-black text-white"
                : "text-gray-500 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-b-2xl rounded-tr-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-end">
          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-900">Location</label>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Bali Indonesia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-8 border-0 p-0 text-sm font-medium text-gray-900 shadow-none focus-visible:ring-0 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Departure Month */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-900">Departure Month</label>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <div className="h-4 w-4 text-gray-400">📅</div>
              <input
                type="text"
                placeholder="Select date range"
                className="h-8 w-full border-0 p-0 text-sm font-medium text-gray-900 shadow-none focus-visible:ring-0 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Guests and Button */}
          <div className="flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-bold text-gray-900">Guests</label>
              <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                <div className="h-4 w-4 text-gray-400">👤</div>
                <input
                  type="text"
                  placeholder="Select guests"
                  className="h-8 w-full border-0 p-0 text-sm font-medium text-gray-900 shadow-none focus-visible:ring-0 placeholder:text-gray-400 outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="flex h-12 w-auto shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95"
            >
              Search Now
              <span className="text-lg">→</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-4">
          <span className="text-xs font-bold text-gray-900">Filters:</span>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                className="rounded-full border border-gray-200 px-4 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
