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
  const gradientHint = color.split(" ")[0].replace("bg-", "from-").replace("/10", "")

  return (
    <div className="glass-effect premium-shadow group relative overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Ambient glow */}
      <div
        className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br ${gradientHint} to-transparent opacity-5 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-colors duration-300 group-hover:text-primary">
            <span
              className={`block h-1.5 w-1.5 rounded-full ${gradientHint.replace("from-", "bg-")} animate-pulse`}
            />
            {title}
          </p>
          <h3 className="text-5xl font-black tracking-tighter text-gray-900 transition-all duration-500 group-hover:translate-x-1 group-hover:text-primary">
            {value || 0}
          </h3>
        </div>

        {/* Minimal Icon Box */}
        <div
          className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${color.split(" ")[1]}`}
        >
          <div className="absolute inset-0 rounded-2xl bg-white/40 ring-1 ring-white/20 backdrop-blur-sm" />
          <Icon className="relative h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>

      {/* Subtle decorative element */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary/40 transition-all duration-700 ease-out group-hover:w-full" />
    </div>
  )
}

