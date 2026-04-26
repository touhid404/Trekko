import { PendingGuidesList } from "@/components/admin/pending-guides-list"

export default function PendingGuidesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Review Queue
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Pending Guides</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Review and approve/reject submitted travel guides
        </p>
      </div>

      <PendingGuidesList />
    </div>
  )
}
