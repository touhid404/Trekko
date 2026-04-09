"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MapPin,
  Shield,
  Zap,
  Award,
  Heart,
  BookOpen,
  Globe,
  TrendingUp,
  Lock,
  MessageSquare,
  Clock,
} from "lucide-react"

interface Feature {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  highlight?: boolean
}

const features: Feature[] = [
  {
    id: 1,
    title: "Verified Guides",
    description:
      "All travel guides are curated and verified by our expert travel community to ensure quality and accuracy.",
    icon: <Shield className="h-8 w-8" />,
    highlight: true,
  },
  {
    id: 2,
    title: "Local Expertise",
    description:
      "Written by locals and experienced travelers who know hidden gems and authentic experiences in every destination.",
    icon: <MapPin className="h-8 w-8" />,
  },
  {
    id: 3,
    title: "Community Driven",
    description:
      "Vote on guides, leave reviews, and connect with millions of travelers who share your passion for exploration.",
    icon: <Users className="h-8 w-8" />,
    highlight: true,
  },
  {
    id: 4,
    title: "Always Updated",
    description:
      "Guides are continuously updated with latest information, new attractions, and current travel tips.",
    icon: <TrendingUp className="h-8 w-8" />,
  },
  {
    id: 5,
    title: "Real Reviews",
    description:
      "Authentic feedback from real travelers helps you make informed decisions for your trip planning.",
    icon: <Award className="h-8 w-8" />,
    highlight: true,
  },
  {
    id: 6,
    title: "Personalized Experience",
    description:
      "Customize your preferences, save favorites, and get recommendations tailored to your travel style.",
    icon: <Heart className="h-8 w-8" />,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          {/* <Badge className="mb-4 flex items-center justify-center gap-1 bg-white text-black">
            <Clock className="mr-1 h-3 w-3" />
            Why Choose Our Platform
          </Badge> */}
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            Why Travelers Love Us
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600">
            We're not just another travel guide platform. We're a community of
            passionate travelers dedicated to helping you discover authentic
            experiences and create unforgettable memories around the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`transition-all duration-300 ${
                feature.highlight ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <Card
                className={`relative h-full border-l-4 transition-all duration-300 hover:shadow-xl ${
                  feature.highlight
                    ? "border-[#1989a3] bg-gradient-to-br from-[#1989a3]/10 to-white shadow-lg"
                    : "border-l-gray-200 hover:border-[#1989a3]"
                }`}
              >
                {/* Highlight Badge */}
                {feature.highlight && (
                  <Badge className="absolute top-4 right-4 bg-[#1989a3] text-white">
                    Popular
                  </Badge>
                )}

                <CardContent className="p-6">
                  {/* Icon Container */}
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg ${
                      feature.highlight
                        ? "bg-[#1989a3] text-white"
                        : "bg-[#1989a3]/10 text-[#1989a3]"
                    }`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>

                  {/* Icon decoration */}
                  <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 transform opacity-5">
                    {feature.icon}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="rounded-2xl bg-gradient-to-r from-[#1989a3] to-[#1989a3] p-8 text-white md:p-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { number: "5000+", label: "Travel Guides", icon: "📚" },
              { number: "150+", label: "Destinations", icon: "🌍" },
              { number: "12K+", label: "Active Travelers", icon: "👥" },
              { number: "98%", label: "Satisfaction Rate", icon: "⭐" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl">{stat.icon}</div>
                <div className="mb-1 text-3xl font-bold md:text-4xl">
                  {stat.number}
                </div>
                <p className="text-sm text-blue-100 md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  )
}
