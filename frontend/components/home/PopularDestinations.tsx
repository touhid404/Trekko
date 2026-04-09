"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  TrendingUp,
  Users,
  BookOpen,
  ArrowRight,
  Compass,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Destination {
  id: string
  name: string
  country: string
  image: string
  guidesCount: number
  visitorsCount: number
  description: string
  icon: string
  trending: boolean
}

const popularDestinations: Destination[] = [
  {
    id: "1",
    name: "Tokyo",
    country: "Japan",
    image: "/assets/hero/hero.jpg",
    guidesCount: 124,
    visitorsCount: 5420,
    description: "Modern meets tradition in Japan's vibrant capital",
    icon: "🗼",
    trending: true,
  },
  {
    id: "2",
    name: "Paris",
    country: "France",
    image: "/assets/hero/hero.jpg",
    guidesCount: 98,
    visitorsCount: 4890,
    description: "The city of love, art, and timeless elegance",
    icon: "🗿",
    trending: true,
  },
  {
    id: "3",
    name: "Bali",
    country: "Indonesia",
    image: "/assets/hero/hero.jpg",
    guidesCount: 156,
    visitorsCount: 6230,
    description: "Tropical paradise with stunning beaches and temples",
    icon: "🏝️",
    trending: false,
  },
  {
    id: "4",
    name: "New York",
    country: "USA",
    image: "/assets/hero/hero.jpg",
    guidesCount: 187,
    visitorsCount: 7150,
    description: "The city that never sleeps with endless possibilities",
    icon: "🗽",
    trending: false,
  },
  {
    id: "5",
    name: "Barcelona",
    country: "Spain",
    image: "/assets/hero/hero.jpg",
    guidesCount: 112,
    visitorsCount: 4560,
    description: "Architecture, beaches, and vibrant Mediterranean culture",
    icon: "🎨",
    trending: true,
  },
  {
    id: "6",
    name: "Dubai",
    country: "UAE",
    image: "/assets/hero/hero.jpg",
    guidesCount: 89,
    visitorsCount: 3890,
    description: "Ultra-modern luxury in the heart of the desert",
    icon: "🏙️",
    trending: false,
  },
]

export default function PopularDestinations() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Compass className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
              Explore Destinations
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Popular Travel Destinations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover our most loved travel destinations with comprehensive
            guides created by our community of travel enthusiasts
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularDestinations.map((destination) => (
            <Link
              key={destination.id}
              href={`/travel-guides?destination=${destination.id}`}
            >
              <Card className="h-full transform cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  {/* Trending Badge */}
                  {destination.trending && (
                    <div className="absolute top-3 right-3">
                      <Badge className="flex items-center gap-1 bg-red-500 text-white">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </Badge>
                    </div>
                  )}

                  {/* Icon Overlay */}
                  <div className="absolute bottom-3 left-3 rounded-full bg-white p-3 text-2xl shadow-md">
                    {destination.icon}
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-5">
                  {/* Title Section */}
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {destination.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {destination.country}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {destination.description}
                  </p>

                  {/* Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-3 border-t border-b border-gray-200 py-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-500">Guides</div>
                        <div className="font-bold text-gray-900">
                          {destination.guidesCount}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-500">Visitors</div>
                        <div className="font-bold text-gray-900">
                          {destination.visitorsCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button className="group w-full bg-blue-600 text-white hover:bg-blue-700">
                    Explore Guides
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link href="/travel-guides">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              View All Destinations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
