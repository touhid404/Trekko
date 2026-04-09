import { getSubmission } from "@/app/actions/member/getSubmission"
import PublishedList from "@/components/modules/member/published-list"

export default async function PublishedPage() {
  const initialData = await getSubmission(1, 10)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Published Guides</h1>
          <p className="mt-2 text-muted-foreground">
            View all your published and approved travel guides
          </p>
        </div>

        <PublishedList initialData={initialData} />
      </div>
    </div>
  )
}
