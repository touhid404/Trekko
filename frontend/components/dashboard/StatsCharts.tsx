"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface StatsData {
  totalUsers?: number
  totalGuides?: number
  totalCategories?: number
  totalPurchases?: number
  existGuideCount?: number
  existPurchasesCount?: number
  existRejectedCount?: number
}

interface StatsChartsProps {
  stats: StatsData
}

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"] // blue, emerald, violet, amber

export function StatsCharts({ stats }: StatsChartsProps) {
  const isAdmin = "totalUsers" in stats

  if (isAdmin) {
    const data = [
      { name: "Users", value: stats.totalUsers || 0 },
      { name: "Guides", value: stats.totalGuides || 0 },
      { name: "Categories", value: stats.totalCategories || 0 },
      { name: "Purchases", value: stats.totalPurchases || 0 },
    ]

    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-500">Platform Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f3f4f6" }} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-500">Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={90}
                innerRadius={60}
                fill="#3b82f6"
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  // Member charts
  const data = [
    { name: "My Guides", value: stats.existGuideCount || 0 },
    { name: "Purchases", value: stats.existPurchasesCount || 0 },
    { name: "Rejected", value: stats.existRejectedCount || 0 },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-500">My Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "#f3f4f6" }} contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-[13px] font-bold uppercase tracking-widest text-gray-500">Activity Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={90}
              innerRadius={60}
              fill="#10b981"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
