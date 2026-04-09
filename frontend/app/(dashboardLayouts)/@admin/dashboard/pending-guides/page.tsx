import { PendingGuidesList } from "@/components/admin/pending-guides-list"

export default function PendingGuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pending Guides for Review</h1>
          <p className="mt-2 text-muted-foreground">
            Review and approve/reject submitted travel guides
          </p>
        </div>

        <PendingGuidesList />
      </div>
    </div>
  )
}
