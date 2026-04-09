/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { changePasswordAction } from "@/app/actions/auth/change-password"
import { IChangePasswordPayload } from "@/types/auth.types"
import { KeyRound, ArrowLeft } from "lucide-react"

export function ChangePasswordForm() {
  const [loading, setLoading] = React.useState(false)

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const payload: IChangePasswordPayload = {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
          confirmNewPassword: value.confirmNewPassword,
        }

        const result = await changePasswordAction(payload)

        if (!result.success) {
          toast.error(result.message || "Failed to change password")
          return
        }

        form.reset()
        toast.success("Password updated successfully.")
      } catch (err: unknown) {
        const error = err as any
        if (
          error &&
          typeof error === "object" &&
          "digest" in error &&
          typeof error.digest === "string" &&
          error.digest.startsWith("NEXT_REDIRECT")
        ) {
          throw error
        }

        console.error("Change password error:", error)
        toast.error(
          error?.message || "An error occurred during password change"
        )
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="flex w-full max-w-xl flex-col">
      <div className="mb-8">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 shadow-sm">
          <KeyRound className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-gray-900">Security Setting</h1>
        <p className="mt-2 text-lg text-gray-500">
          Update your authentication credentials securely to protect your Trekko.
        </p>
      </div>

      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm lg:p-10">
        <form.Provider>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field name="currentPassword">
              {(field) => (
                <Field>
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Current Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    className="h-14 rounded-xl bg-gray-50 px-4 transition-all focus:bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors.map(String)} />
                </Field>
              )}
            </form.Field>

            <form.Field name="newPassword">
              {(field) => (
                <Field>
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">New Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Create new password"
                    className="h-14 rounded-xl bg-gray-50 px-4 transition-all focus:bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors.map(String)} />
                </Field>
              )}
            </form.Field>

            <form.Field name="confirmNewPassword">
              {(field) => (
                <Field>
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">Confirm New Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="Verify new password"
                    className="h-14 rounded-xl bg-gray-50 px-4 transition-all focus:bg-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors.map(String)} />
                </Field>
              )}
            </form.Field>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-2xl bg-gray-900 font-bold uppercase tracking-widest hover:bg-black transition-all sm:w-auto sm:flex-1"
              >
                {loading ? "Authenticating..." : "Change Password"}
              </Button>

              <Link
                href="/dashboard"
                className="flex h-14 w-full sm:w-auto sm:flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white font-bold uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Return
              </Link>
            </div>
          </form>
        </form.Provider>
      </div>
    </div>
  )
}
