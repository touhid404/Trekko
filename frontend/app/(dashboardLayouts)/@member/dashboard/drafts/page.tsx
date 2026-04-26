import { getDrafts } from "@/app/actions/member/get-drafts"
import DraftsList from "@/components/modules/member/drafts-list"
import { Suspense } from "react"

async function DraftsContent() {
  let response
  try {
    response = await getDrafts(1, 10)
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

  return <DraftsList initialData={response.data} />
}

export default function DraftsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Workspace
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Drafts</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
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
  )
}
