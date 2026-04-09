import { getUnderReview } from "@/app/actions/member/getUnderReview"
import UnderReviewList from "@/components/modules/member/underreview-list"

export default async function SubmissionsPage() {
  const initialData = await getUnderReview(1, 10)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submissions (Under Review)</h1>
          <p className="mt-2 text-muted-foreground">
            Track the status of your guides currently under review
          </p>
        </div>

        <UnderReviewList initialData={initialData} />
      </div>
    </div>
  )
}
