import { getSubmission } from "@/app/actions/member/getSubmission"
import PublishedList from "@/components/modules/member/published-list"

export default async function PublishedPage() {
  const initialData = await getSubmission(1, 10)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Repository
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Published Guides</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          View all your published and approved travel guides
        </p>
      </div>

        <PublishedList initialData={initialData} />
      </div>
  )
}
