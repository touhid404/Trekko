"use server"

import { axiosInstance } from "@/lib/axios/httpClient"
import { redirect } from "next/navigation"
import {
  IChangePasswordPayload,
  IChangePasswordResponse,
} from "@/types/auth.types"
import { changePasswordSchema } from "@/zod/auth.validation"
import { logoutAction } from "./logout"

export const changePasswordAction = async (
  payload: IChangePasswordPayload
): Promise<IChangePasswordResponse> => {
  const parsedPayload = changePasswordSchema.safeParse(payload)

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message,
    }
  }

  try {
    const instance = await axiosInstance
    const response = await instance.post<IChangePasswordResponse>(
      "/members/change-password",
      {
        currentPassword: parsedPayload.data.currentPassword,
        newPassword: parsedPayload.data.newPassword,
        confirmPassword: parsedPayload.data.confirmNewPassword,
      }
    )

    await logoutAction()

    return response.data
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    return {
      success: false,
      message: `Change password failed: ${
        error.response?.data?.message || error.message || "Unknown error"
      }`,
    }
  }
}
