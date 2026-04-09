import { getUserInfo } from "@/services/auth.service"
import { MyProfileCard } from "@/components/modules/profile/my-profile-card"

export default async function MyProfilePage() {
  const user = await getUserInfo()



  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground">
            This section shows your account information and membership details.
          </p>
        </div>

        {user ? (
          <MyProfileCard user={user} />
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-lg font-medium">
              No profile information available.
            </p>
            <p className="text-sm text-muted-foreground">
              Please log in to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
