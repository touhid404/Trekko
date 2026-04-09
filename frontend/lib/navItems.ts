import { NavSection, UserRole } from "@/types/dashboard.navItems.types"
import { getDefaultDashboardRoute } from "./authUtils"

/**
 * Common navigation items for all authenticated users
 */
const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role)
  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "User",
        },
        {
          title: "Travel Guides",
          href: "/travel-guides",
          icon: "Map",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        // {
        //   title: "Account Settings",
        //   href: "/settings/account",
        //   icon: "Settings",
        // },
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Lock",
        },
      ],
    },
  ]
}

/**
 * Admin navigation items
 */
const adminNavItems: NavSection[] = [
  {
    title: "Guide Management",
    items: [
      {
        title: "Pending Guides",
        href: "/dashboard/pending-guides",
        icon: "Clock",
      },
      {
        title: "Approved Guides",
        href: "/dashboard/approved-guides",
        icon: "CheckCircle",
      },
      {
        title: "Rejected Guides",
        href: "/dashboard/rejected-guides",
        icon: "XCircle",
      },
      {
        title: "All Guides",
        href: "/dashboard/all-guides",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Category Management",
    items: [
      {
        title: "see all categories",
        href: "/dashboard/categories",
        icon: "Tags",
      },
      {
        title: "Create Category",
        href: "/dashboard/create-category",
        icon: "Plus",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Manage Members",
        href: "/dashboard/members",
        icon: "Users",
      },
    ],
  },
  // {
  //   title: "Feedback & Moderation",
  //   items: [
  //     {
  //       title: "Feedback Queue",
  //       href: "/dashboard/feedback",
  //       icon: "MessageSquare",
  //     },
  //   ],
  // },
]

/**
 * Member navigation items
 */
const memberNavItems: NavSection[] = [
  {
    title: "My Guides",
    items: [
      {
        title: "Create Guide",
        href: "/dashboard/create-guide",
        icon: "Plus",
      },
      {
        title: "My Drafts",
        href: "/dashboard/drafts",
        icon: "BookOpen",
      },
      {
        title: "Published Guides",
        href: "/dashboard/published",
        icon: "CheckCircle",
      },
      {
        title: "My Submissions",
        href: "/dashboard/submissions",
        icon: "Send",
      },
    ],
  },
  {
    title: "Purchase History",
    items: [
      {
        title: "My Purchases Guides",
        href: "/dashboard/purchases",
        icon: "ShoppingCart",
      },
    ],
  },
  {
    title: "Reviews & Feedback",
    items: [
      {
        title: " Rejected Guides",
        href: "/dashboard/feedback",
        icon: "MessageSquare",
      },
    ],
  },
]

/**
 * Get navigation items based on user role
 */
export const getNavItems = (role: UserRole): NavSection[] => {
  const commonRoutes = getCommonNavItems(role)

  switch (role) {
    case "ADMIN":
      return [...commonRoutes, ...adminNavItems]
    case "MEMBER":
      return [...commonRoutes, ...memberNavItems]
    default:
      return commonRoutes
  }
}

/**
 * Get navigation items for specific section (e.g., sidebar, header menu)
 */
export const getDashboardNavItems = (role: UserRole): NavSection[] => {
  switch (role) {
    case "ADMIN":
      return adminNavItems
    case "MEMBER":
      return memberNavItems
    default:
      return []
  }
}
