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
    <div className="w-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="p-8 pb-4">
        <h3 className="text-xl font-black tracking-tight text-gray-900">Profile Info</h3>
      </div>
      <div className="p-8 pt-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative group">
            {profileImage ? (
              <img
                src={`https://i.ibb.co.com/mFqdcTzQ/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile.avif`}
                alt="profile"
                className="h-32 w-32 rounded-[2rem] border-4 border-gray-50 object-cover shadow-sm transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-gray-900 text-4xl font-black text-white shadow-sm transition-transform duration-500 group-hover:scale-105">
                {initials}
              </div>
            )}
            {!profileImage && (
              <span className="absolute right-[-4px] bottom-[-4px] flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 shadow-sm border-2 border-white text-sm font-bold text-white">
                ?
              </span>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-black text-gray-900">{user.name || "N/A"}</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {user.email || "No email"}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: "Role", value: (user.role || "guest").toLowerCase(), emphasize: true },
            { label: "Email Verified", value: user.emailVerified ? "Yes" : "No", emphasize: false },
            { label: "Member Since", value: memberSince, emphasize: false },
            { label: "User ID", value: user.id || "N/A", emphasize: false }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-gray-50 p-6 transition-colors hover:bg-gray-100/50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{item.label}</p>
              <p className={`font-semibold breakdown-all ${item.emphasize ? 'text-gray-900 capitalize' : 'text-gray-600'}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
