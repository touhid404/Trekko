"use server"

import { axiosInstance } from "@/lib/axios/httpClient"

interface Category {
  data: {
    id: string
    title: string
  }[]
}

export async function getCategories(): Promise<Category[]> {
  try {
    const instance = axiosInstance
    const response = await instance.get("/categories")

    // Handle different possible response structures
    let categories: any = response.data

    // New API shape: response.data.data.data is the category array
    if (
      response.data?.data &&
      response.data.data.data &&
      Array.isArray(response.data.data.data)
    ) {
      categories = response.data.data.data
    }
    // Fallback: response.data.data as array
    else if (response.data?.data && Array.isArray(response.data.data)) {
      categories = response.data.data
    }
    // If response.data is array, use it
    else if (Array.isArray(response.data)) {
      categories = response.data
    }
    // If response.data.data exists but not array, wrap it
    else if (response.data?.data && typeof response.data.data === "object") {
      categories = [response.data.data]
    }
    // Default to empty array
    else {
      categories = []
    }

    // Ensure each category has id and title
    return categories.map((cat: any) => {
      const rawTitle = cat?.title || cat?.name || String(cat)
      const title =
        rawTitle && typeof rawTitle === "object"
          ? JSON.stringify(rawTitle)
          : String(rawTitle)

      return {
        id: String(cat?.id || cat?._id || title),
        title,
      }
    })
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}
