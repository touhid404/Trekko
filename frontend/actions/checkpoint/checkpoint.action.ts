/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { axiosInstance } from "@/lib/axios/httpClient"

export const toggleCheckpointAction = async (checkpointId: string) => {
  try {
    const response = await axiosInstance.post(`/checkpoints/${checkpointId}/toggle`)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    }
  }
}

export const getGuideProgressAction = async (guideId: string) => {
  try {
    const response = await axiosInstance.get(`/checkpoints/guide/${guideId}/progress`)
    return response.data
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    }
  }
}
