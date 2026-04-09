import { ApprovedGuidesList } from "@/components/admin/approved-guides-list"

export default function ApprovedGuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Approved Guides</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage all approved travel guides
          </p>
        </div>

        <ApprovedGuidesList />
      </div>
    </div>
  )
}
