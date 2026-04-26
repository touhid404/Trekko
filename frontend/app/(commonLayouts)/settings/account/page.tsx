import Link from "next/link"

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Preferences
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Update your profile and security settings
        </p>
      </div>

      <div className="mt-6 rounded-lg border bg-card p-6">
        <div className="mb-4">
          <p className="text-base">Under construction</p>
        </div>
        <Link
          href="/settings/change-password"
          className="text-primary underline"
        >
          Go to change password
        </Link>
      </div>
    </div>
  )
}
