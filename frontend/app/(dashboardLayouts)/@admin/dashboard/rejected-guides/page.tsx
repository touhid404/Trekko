import { RejectedGuidesList } from "@/components/admin/rejected-guides-list"

export default function RejectedGuidesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Rejected Guides</h1>
          <p className="mt-2 text-muted-foreground">
            View rejected travel guides with feedback
          </p>
        </div>

        <RejectedGuidesList />
      </div>
    </div>
  )
}
