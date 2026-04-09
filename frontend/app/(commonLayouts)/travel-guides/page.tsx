import * as React from "react"
import { GuidesList } from "@/components/modules/member/guides-list"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"

export default async function TravelGuidesPage() {
  const result = await travelGuideServices.getAll(1, 9)

  const initialData = result.success
    ? {
      guides: result.data.data,
      totalPages: result.data.meta.totalPages,
      total: result.data.meta.total,
    }
    : {
      guides: [],
      totalPages: 0,
      total: 0,
    }

  return (
    <div className="min-h-screen bg-background">
     

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Loading guides...
              </div>
            </div>
          }
        >
          <GuidesList initialData={initialData} />
        </React.Suspense>
      </div>
    </div>
  )
}
