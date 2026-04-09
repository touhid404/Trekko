import { AllGuidesList } from "@/components/admin/all-guides-list"
import { getAllGuidesAction } from "@/app/actions/admin/getAllGuidesAction"
import { Guide } from "@/services/admin/all-guides.service"

const LIMIT = 10

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AllGuidesPage({ searchParams }: PageProps) {
  const page = parseInt((searchParams.page as string) || "1")
  const sort = (searchParams.sort as string) || "all"
  const status = (searchParams.status as string) || "all"

  const filter = status !== "all" ? { status } : undefined
  const sortParam = sort === "all" ? undefined : sort

  const response = await getAllGuidesAction(
    page,
    LIMIT,
    sortParam,
    undefined,
    filter
  )

  const initialGuides = response?.data || []
  const initialTotal = response?.meta?.total || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Guide Management</h1>
          <p className="mt-2 text-muted-foreground">
            View, edit, and manage all travel guides
          </p>
        </div>

        <AllGuidesList
          initialGuides={initialGuides}
          initialTotal={initialTotal}
          initialPage={page}
        />
      </div>
    </div>
  )
}
