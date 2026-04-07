import { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: string
  badge?: string
  disabled?: boolean
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export type UserRole = "ADMIN" | "MEMBER" | "GUEST"
