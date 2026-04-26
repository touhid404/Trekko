import { AllGuidesList } from "@/components/admin/all-guides-list"
import { getAllGuidesAction } from "@/app/actions/admin/getAllGuidesAction"

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
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Directory
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Guide Management</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          View, edit, and manage all travel guides
        </p>
      </div>

        <AllGuidesList
          initialGuides={initialGuides}
          initialTotal={initialTotal}
          initialPage={page}
        />
    </div>
  )
}
