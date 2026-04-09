"use server"

import travelGuideServices from "@/services/travelGuide/travelGuide.service"

export interface IQueryResult<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DraftGuide {
  id: string
  memberId: string
  categoryId: string
  title: string
  description: string
  itinerary: string
  status: string
  isPaid: boolean
  price: number
  coverImage: string
  isDeleted: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  guideMedia: Array<{
    id: string
    guideId: string
    type: string
    url: string
    createdAt: string
    updatedAt: string
  }>
  votes: any[]
  comments: any[]
  category: {
    id: string
    slug: string
    title: string
    description: string
    isDeleted: boolean
    deletedAt: string | null
    createdAt: string
    updatedAt: string
  }
}

export interface GetDraftsResponse {
  data: IQueryResult<DraftGuide>
  success: boolean
  message: string
}

export async function getDrafts(
  page: number = 1,
  limit: number = 10,
  sort?: string,
  search?: string
): Promise<GetDraftsResponse> {
  return await travelGuideServices.getDrafts(page, limit, sort, search)
}
