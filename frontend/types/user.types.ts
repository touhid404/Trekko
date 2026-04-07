import { UserRole } from "./dashboard.navItems.types"

export interface UserInfo {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
}
