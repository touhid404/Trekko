"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { changePasswordAction } from "@/app/actions/auth/change-password"
import { IChangePasswordPayload } from "@/types/auth.types"

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
        toast.success("Password updated successfully. ")
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
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account credentials securely
          </CardDescription>
        </CardHeader>

        <form.Provider>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <CardContent className="space-y-4">
              <form.Field name="currentPassword">
                {(field) => (
                  <Field>
                    <FieldLabel>Current Password</FieldLabel>
                    <Input
                      type="password"
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
                    <FieldLabel>New Password</FieldLabel>
                    <Input
                      type="password"
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
                    <FieldLabel>Confirm New Password</FieldLabel>
                    <Input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Change Password"}
              </Button>

              <Link href="/dashboard" className="text-primary underline">
                Back to Dashbaord
              </Link>
            </CardFooter>
          </form>
        </form.Provider>
      </Card>
    </div>
  )
}
