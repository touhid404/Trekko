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

export default async function AdminDashboardPage() {
  const result = await getStats()

  if (!result.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Error loading stats: {result.message}
          </p>
        </div>
      </div>
    )
  }

  const stats = (result as IResponse<StatsData>).data || {}

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Admin Dashboard
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Management</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Manage guides, members, and moderation tasks
        </p>
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
  )
}
