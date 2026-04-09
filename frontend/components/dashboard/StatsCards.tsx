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
  return (
    <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-wider text-gray-400 mb-2">{title}</p>
          <h3 className="text-4xl font-black tracking-tight text-gray-900">{value || 0}</h3>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
