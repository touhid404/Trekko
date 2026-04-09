import { CreateCategoryForm } from "@/components/admin/create-category-form"

export default function CreateCategoryPage() {
  return (
    <div className="space-y-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Category</h1>
        <p className="text-muted-foreground">
          Create a new travel guide category
        </p>
      </div>
      <CreateCategoryForm />
    </div>
  )
}
