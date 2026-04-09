"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

export default function SearchSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm.trim()) {
      params.set("searchTerm", searchTerm.trim())
    }
    const queryString = params.toString()
    router.push(`/travel-guides${queryString ? `?${queryString}` : ""}`)
  }

  return (
    <section className="relative z-20 -mt-8 mb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center gap-3 rounded-full border border-gray-100 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex flex-1 items-center gap-3 pl-4">
            <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
            <Input
              type="text"
              placeholder="Search destinations, guides, itineraries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-10 border-0 p-0 text-sm font-medium text-gray-900 shadow-none focus-visible:ring-0 bg-transparent placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
