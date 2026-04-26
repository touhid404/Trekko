import { CategoriesList } from "@/components/admin/categories-list"
import { getCategoriesAction } from "@/app/actions/admin/getCategoriesAction"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const response = await getCategoriesAction(1, 10)

  const initialCategories = response?.data?.data || []
  const initialTotal = response?.data?.meta?.total || 0

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Directory
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categories</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Manage travel guide categories
        </p>
      </div>

      <CategoriesList
        initialCategories={initialCategories}
        initialTotal={initialTotal}
        initialPage={1}
      />
    </div>
  )
}
