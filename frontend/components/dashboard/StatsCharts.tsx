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
        <div className="overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="mb-6">
            <h3 className="text-lg font-bold tracking-tight text-gray-900">
              Platform Intelligence
            </h3>
            <p className="text-sm font-medium text-gray-500">Distribution of platform resources</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} 
                contentStyle={{ 
                  borderRadius: "1rem", 
                  border: "1px solid #f1f5f9", 
                  background: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: "#0f172a"
                }} 
              />
              <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          <div className="mb-6">
            <h3 className="text-lg font-bold tracking-tight text-gray-900">
              Ecosystem Core
            </h3>
            <p className="text-sm font-medium text-gray-500">Breakdown of primary metrics</p>
          </div>
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
                innerRadius={65}
                fill="#1989a3"
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
              <Tooltip 
                 contentStyle={{ 
                  borderRadius: "1.5rem", 
                  border: "none", 
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  padding: "1rem"
                }} 
              />
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
      <div className="overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="mb-6">
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Personal Metrics
          </h3>
          <p className="text-sm font-medium text-gray-500">Overview of your activity</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
               tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
               axisLine={false} 
               tickLine={false} 
            />
            <Tooltip 
               cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} 
               contentStyle={{ 
                borderRadius: "1rem", 
                border: "1px solid #f1f5f9", 
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                padding: "0.75rem 1rem",
                fontWeight: 600,
                color: "#0f172a"
              }} 
            />
            <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-hidden rounded-3xl p-8 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        <div className="mb-6">
          <h3 className="text-lg font-bold tracking-tight text-gray-900">
            Activity Insight
          </h3>
          <p className="text-sm font-medium text-gray-500">Distribution analysis</p>
        </div>
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
              innerRadius={65}
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
            <Tooltip 
               contentStyle={{ 
                borderRadius: "1rem", 
                border: "1px solid #f1f5f9", 
                background: "rgba(255, 255, 255, 0.95)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                padding: "0.75rem 1rem",
                fontWeight: 600,
                color: "#0f172a"
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
