"use server"

import { membersService } from "@/services/admin/members.service"

export async function getMembersAction(
  page: number = 1,
  limit: number = 10,
  sort?: string,
  search?: string,
  filter?: Record<string, string>
) {
  try {
    const response = await membersService.getAll(
      page,
      limit,
      sort,
      search,
      filter
    )
    return response.data
  } catch (error) {
    console.error("Error fetching members:", error)
    throw new Error("Failed to fetch members")
  }
}
