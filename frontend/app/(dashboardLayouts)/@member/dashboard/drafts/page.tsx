import { getDrafts } from "@/app/actions/member/get-drafts"
import DraftsList from "@/components/modules/member/drafts-list"
import { Suspense } from "react"

async function DraftsContent() {
  try {
    const response = await getDrafts(1, 10)

    return <DraftsList initialData={response.data} />
  } catch (error) {
    console.error("Failed to fetch drafts:", error)
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          Failed to load your draft guides. Please try again later.
        </p>
      </div>
    )
  }
}

export default function DraftsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Drafts</h1>
          <p className="mt-2 text-muted-foreground">
            View and continue editing your draft guides
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading your drafts...</p>
            </div>
          }
        >
          <DraftsContent />
        </Suspense>
      </div>
    </div>
  )
}
