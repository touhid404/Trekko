import { getUserInfo } from "@/services/auth.service"
import { MyProfileCard } from "@/components/modules/profile/my-profile-card"

export default async function MyProfilePage() {
  const user = await getUserInfo()



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
            Account Management
          </span>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">My Profile</h1>
          <p className="mt-3 text-lg font-medium text-gray-500">
            View your personal information and membership details.
          </p>
        </div>

        {user ? (
          <MyProfileCard user={user} />
        ) : (
          <div className="rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-gray-900">
              No profile information available.
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500">
              Please log in to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
