import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserInfo } from "@/types/user.types"

interface MyProfileCardProps {
  user: UserInfo & { createdAt?: string; updatedAt?: string }
}

export function MyProfileCard({ user }: MyProfileCardProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("")
    : "US"

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Unknown"

  const profileImage = user?.emailVerified
    ? `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
        user.email
      )}`
    : null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profile Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            {profileImage ? (
              <img
                src={`https://i.ibb.co.com/mFqdcTzQ/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile.avif`}
                alt="profile"
                className="h-28 w-28 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground">
                {initials}
              </div>
            )}
            {!profileImage && (
              <span className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                ?
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name || "N/A"}</h2>
            <p className="text-sm text-muted-foreground">
              {user.email || "No email"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2">
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-xs text-muted-foreground uppercase">Role</p>
            <p className="font-medium capitalize">
              {(user.role || "guest").toLowerCase()}
            </p>
          </div>
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-xs text-muted-foreground uppercase">
              Email Verified
            </p>
            <p className="font-medium">{user.emailVerified ? "Yes" : "No"}</p>
          </div>
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-xs text-muted-foreground uppercase">
              Member since
            </p>
            <p className="font-medium">{memberSince}</p>
          </div>
          <div className="rounded-lg border bg-muted p-4">
            <p className="text-xs text-muted-foreground uppercase">User ID</p>
            <p className="font-medium break-all">{user.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
