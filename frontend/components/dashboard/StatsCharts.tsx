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
        <div className="glass-effect premium-shadow overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl">
          <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            Platform <span className="text-primary italic">Intelligence</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} 
                axisLine={false} 
                tickLine={false} 
                dy={10}
              />
              <YAxis 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <Tooltip 
                cursor={{ fill: "rgba(25, 137, 163, 0.05)" }} 
                contentStyle={{ 
                  borderRadius: "1.5rem", 
                  border: "none", 
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                  padding: "1rem"
                }} 
              />
              <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1989a3" />
                  <stop offset="100%" stopColor="#1989a3" stopOpacity={0.6} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-effect premium-shadow overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl">
          <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            Ecosystem <span className="text-primary italic">Core</span>
          </h3>
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
      <div className="glass-effect premium-shadow overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl">
        <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          Personal <span className="text-primary italic">Metrics</span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} 
              axisLine={false} 
              tickLine={false} 
              dy={10}
            />
            <YAxis 
               tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }} 
               axisLine={false} 
               tickLine={false} 
            />
            <Tooltip 
               cursor={{ fill: "rgba(25, 137, 163, 0.05)" }} 
               contentStyle={{ 
                borderRadius: "1.5rem", 
                border: "none", 
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                padding: "1rem"
              }} 
            />
            <Bar dataKey="value" fill="url(#barGradientMember)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradientMember" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1989a3" />
                <stop offset="100%" stopColor="#1989a3" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-effect premium-shadow overflow-hidden rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl">
        <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
          Activity <span className="text-primary italic">Insight</span>
        </h3>
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
