import { RejectedGuidesList } from "@/components/admin/rejected-guides-list"

export default function RejectedGuidesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Returned
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rejected Guides</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          View rejected travel guides with feedback
        </p>
      </div>

      <RejectedGuidesList />
    </div>
  )
}
