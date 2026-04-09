import { categoriesService } from "@/services/admin/categories.service"
import { Mountain, Camera, Palmtree, Building, Utensils, Waves, Tent, Compass, Backpack, Globe, ChevronRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const categoryIcons: Record<string, React.ReactNode> = {
    adventure: <Mountain className="h-6 w-6" />,
    photography: <Camera className="h-6 w-6" />,
    beach: <Waves className="h-6 w-6" />,
    food: <Utensils className="h-6 w-6" />,
    city: <Building className="h-6 w-6" />,
    nature: <Palmtree className="h-6 w-6" />,
    camping: <Tent className="h-6 w-6" />,
    budget: <Backpack className="h-6 w-6" />,
    culture: <Globe className="h-6 w-6" />,
}

const defaultIcon = <Compass className="h-6 w-6" />

// Curated colors for a premium minimalist aesthetic
const categoryColors: Record<string, string> = {
    adventure: "text-orange-500 bg-orange-50",
    photography: "text-indigo-500 bg-indigo-50",
    beach: "text-cyan-500 bg-cyan-50",
    food: "text-rose-500 bg-rose-50",
    city: "text-blue-500 bg-blue-50",
    nature: "text-emerald-500 bg-emerald-50",
    camping: "text-amber-500 bg-amber-50",
    budget: "text-lime-500 bg-lime-50",
    culture: "text-purple-500 bg-purple-50",
}

export default async function PopularCategories() {
    let categories: { id: string; slug: string; title: string; description: string | null; guides: unknown[] }[] = []

    try {
        const response = await categoriesService.getAll(1, 20)
        if (response.success && response.data?.data) {
            categories = response.data.data
        }
    } catch {
        // Silently fail
    }

    if (categories.length === 0) return null

    // Show only the top 5 categories
    const displayCategories = categories.slice(0, 5)
    const totalCategories = categories.length

    return (
        <section className="py-24 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div>
                        <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                            Browse Interests
                        </span>
                        <h2 className="text-4xl font-black tracking-tight text-gray-900">
                            Popular Categories
                        </h2>
                    </div>
                    <Link
                        href="/travel-guides"
                        className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-700 shadow-sm transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                        All {totalCategories} categories
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Category Grid — 2 large + 3 small */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
                    {displayCategories.map((category, idx) => {
                        const icon = categoryIcons[category.slug.toLowerCase()] || defaultIcon
                        const colorClass = categoryColors[category.slug.toLowerCase()] || "text-gray-500 bg-gray-100"
                        const guideCount = category.guides?.length ?? 0

                        // First 2 cards are "featured" (span 6 columns), rest span 4
                        const isFeatured = idx < 2
                        const colSpan = isFeatured ? "lg:col-span-6" : "lg:col-span-4"
                        const height = isFeatured ? "h-64" : "h-56"

                        return (
                            <Link
                                key={category.id}
                                href={`/travel-guides?categoryId=${category.id}`}
                                className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl ${colSpan} ${height}`}
                            >
                                {/* Top Layout: Icon & Arrow */}
                                <div className="flex items-start justify-between">
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} transition-transform duration-300 group-hover:scale-110`}>
                                        {icon}
                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-gray-50 text-gray-400 opacity-0 transition-all duration-300 group-hover:bg-gray-900 group-hover:text-white group-hover:opacity-100 group-hover:border-gray-900">
                                        <ArrowUpRight className="h-4 w-4" />
                                    </div>
                                </div>

                                {/* Bottom Layout: Text */}
                                <div className="mt-auto">
                                    <h3 className="text-2xl font-black tracking-tight text-gray-900">
                                        {category.title}
                                    </h3>
                                    <p className="mt-2 text-[13px] font-semibold text-gray-500">
                                        {guideCount} {guideCount === 1 ? "Curated Guide" : "Curated Guides"}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
