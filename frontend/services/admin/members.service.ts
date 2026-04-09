import { refreshCookie } from "@/lib/axios/refreshCookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface Member {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  profilePhoto: string | null
  role: "ADMIN" | "MEMBER"
  status?: "ACTIVE" | "INACTIVE"
  bio: string | null
  address: string | null
  gender: string | null
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  guides: Array<{
    id: string
    title: string
    status: string
    createdAt: string
  }>
  _count: {
    guides: number
    comments: number
    votes: number
  }
}

export interface MembersResponse {
  success: boolean
  message: string
  data: {
    data: Member[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface UpdateStatusResponse {
  success: boolean
  message: string
  data: Member
}

export interface UpdateRoleResponse {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: "ADMIN" | "MEMBER"
    status: string
    updatedAt: string
  }
}

export const membersService = {
  async getAll(
    page: number = 1,
    limit: number = 10,
    sort?: string,
    search?: string,
    filter?: Record<string, string>
  ): Promise<MembersResponse> {
    const url = new URL(`${API_BASE_URL}/admin/members`)

    url.searchParams.append("page", String(page))
    url.searchParams.append("limit", String(limit))

    if (sort) {
      if (sort.startsWith("-")) {
        url.searchParams.append("sortBy", sort.substring(1))
        url.searchParams.append("sortOrder", "desc")
      } else {
        url.searchParams.append("sortBy", sort)
        url.searchParams.append("sortOrder", "asc")
      }
    }

    if (search) {
      url.searchParams.append("searchTerm", search)
    }

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value)
        }
      })
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      cache: "no-store",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch members: ${response.statusText}`)
    }

    return response.json()
  },

  async updateStatus(
    memberId: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<UpdateStatusResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/members/${memberId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: await refreshCookie(),
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update member status: ${response.statusText}`)
    }

    return response.json()
  },

  async updateRole(
    memberId: string,
    role: "ADMIN" | "MEMBER"
  ): Promise<UpdateRoleResponse> {
    const response = await fetch(
      `${API_BASE_URL}/admin/members/${memberId}/role`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: await refreshCookie(),
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to update member role: ${response.statusText}`)
    }

    return response.json()
  },
}
