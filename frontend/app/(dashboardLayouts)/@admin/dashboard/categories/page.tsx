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
    <div className="space-y-6 p-4 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage travel guide categories
          </p>
        </div>
      </div>

      <CategoriesList
        initialCategories={initialCategories}
        initialTotal={initialTotal}
        initialPage={1}
      />
    </div>
  )
}
