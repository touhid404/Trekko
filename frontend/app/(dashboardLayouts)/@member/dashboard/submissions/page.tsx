import { getUnderReview } from "@/app/actions/member/getUnderReview"
import UnderReviewList from "@/components/modules/member/underreview-list"

export default async function SubmissionsPage() {
  const initialData = await getUnderReview(1, 10)

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Status
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Submissions</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Track the status of your guides currently under review
        </p>
      </div>

        <UnderReviewList initialData={initialData} />
      </div>
  )
}
