import { CreateCategoryForm } from "@/components/admin/create-category-form"

export default function CreateCategoryPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Builder
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Category</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Create a new travel guide category
        </p>
      </div>
      <CreateCategoryForm />
    </div>
  )
}
