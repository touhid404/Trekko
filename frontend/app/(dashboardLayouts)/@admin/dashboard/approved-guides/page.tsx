import { ApprovedGuidesList } from "@/components/admin/approved-guides-list"

export default function ApprovedGuidesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Published
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Approved Guides</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          View and manage all approved travel guides
        </p>
      </div>

      <ApprovedGuidesList />
    </div>
  )
}
