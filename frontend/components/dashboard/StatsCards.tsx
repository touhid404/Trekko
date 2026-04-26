import { Users, FileText, LayoutList, CreditCard, ShoppingBag, XCircle } from "lucide-react"

interface StatsData {
  totalUsers?: number
  totalGuides?: number
  totalCategories?: number
  totalPurchases?: number
  existGuideCount?: number
  existPurchasesCount?: number
  existRejectedCount?: number
}

interface StatsCardsProps {
  stats: StatsData
}

export function StatsCards({ stats }: StatsCardsProps) {
  const isAdmin = "totalUsers" in stats

  if (isAdmin) {
    return (
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-500/10 text-blue-600" />
        <StatCard title="Total Guides" value={stats.totalGuides} icon={FileText} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard title="Total Categories" value={stats.totalCategories} icon={LayoutList} color="bg-violet-500/10 text-violet-600" />
        <StatCard title="Total Purchases" value={stats.totalPurchases} icon={CreditCard} color="bg-orange-500/10 text-orange-600" />
      </div>
    )
  }

  // Member stats
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard title="My Guides" value={stats.existGuideCount} icon={FileText} color="bg-emerald-500/10 text-emerald-600" />
      <StatCard title="My Purchases" value={stats.existPurchasesCount} icon={ShoppingBag} color="bg-blue-500/10 text-blue-600" />
      <StatCard title="Rejected Guides" value={stats.existRejectedCount} icon={XCircle} color="bg-rose-500/10 text-rose-600" />
    </div>
  )
}

import React from 'react';

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value?: number | string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="glass-effect overflow-hidden rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] group relative">
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors duration-300 group-hover:text-gray-900">
            {title}
          </p>
          <h3 className="text-4xl font-bold tracking-tight text-gray-900 transition-all duration-300">
            {value || 0}
          </h3>
        </div>

        {/* Minimal Icon Box */}
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${color.split(" ")[1]} ring-4 ring-gray-50`}
        >
          <Icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary/40 transition-all duration-700 ease-out group-hover:w-full" />
    </div>
  )
}

