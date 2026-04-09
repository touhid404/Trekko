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

function StatCard({ title, value, icon: Icon, color }: { title: string, value?: number | string, icon: React.ElementType, color: string }) {
  // Extract base color hint for the glow (e.g. from "bg-blue-500/10 text-blue-600" to "from-blue-500")
  const gradientHint = color.split(' ')[0].replace('bg-', 'from-').replace('/10', '')

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-xs ring-1 ring-gray-900/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-200/50">
      {/* Ambient background glow orb */}
      <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br ${gradientHint} to-transparent opacity-10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-30`} />

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 transition-colors duration-300 group-hover:text-gray-600 flex items-center gap-2">
            <span className={`block h-1.5 w-1.5 rounded-full ${gradientHint.replace('from-', 'bg-')} bg-opacity-50`} />
            {title}
          </p>
          <h3 className="text-5xl font-black tracking-tighter text-gray-900 transition-transform duration-500 group-hover:translate-x-1">
            {value || 0}
          </h3>
        </div>

        {/* Dynamic Icon Box */}
        <div className={`relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[1.5rem] transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 ${color}`}>
          <div className="absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-current opacity-10" />
          <Icon className="h-8 w-8 transition-transform duration-500 group-hover:scale-110" />
        </div>
      </div>

      {/* Subtle bottom hover line */}
      <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gray-900 transition-all duration-700 ease-out group-hover:w-full" />
    </div>
  )
}

