import { getStats } from "@/actions/dashboard/getStatsAction"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { StatsCharts } from "@/components/dashboard/StatsCharts"
import { IResponse } from "@/types/api.types"

interface StatsData {
  totalUsers?: number
  totalGuides?: number
  totalCategories?: number
  totalPurchases?: number
  existGuideCount?: number
  existPurchasesCount?: number
  existRejectedCount?: number
}

export default async function MemberDashboardPage() {
  const result = await getStats()

  if (!result.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight">My Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Error loading stats: {result.message}
          </p>
        </div>
      </div>
    )
  }

  const stats = (result as IResponse<StatsData>).data || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
            Trekko Dashboard
          </span>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Platform Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards stats={stats} />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <StatsCharts stats={stats} />
        </div>
      </div>
    </div>
  )
}
