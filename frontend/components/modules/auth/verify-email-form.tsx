"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { verifyEmailAction } from "@/app/actions/auth/verify-email"
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

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState("")

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setCode(value)
    setErrors("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!code) {
        setErrors("Verification code is required")
        setLoading(false)
        return
      }

      if (code.length !== 6) {
        setErrors("Code must be exactly 6 digits")
        setLoading(false)
        return
      }

      const result = await verifyEmailAction({
        email,
        code,
      })

      if (!result.success) {
        setErrors(result.message || "Verification failed")
        toast.error(result.message || "Verification failed")
        return
      }

      toast.success("Email verified successfully!")
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
      console.error("Verification error:", error)
      toast.error(error?.message || "An error occurred during verification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify Email</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input value={email} disabled className="bg-gray-50" />
            </Field>

            <Field>
              <FieldLabel>Verification Code</FieldLabel>
              <Input
                type="text"
                placeholder="000000"
                value={code}
                onChange={handleCodeChange}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                disabled={loading}
              />
              {errors && <FieldError errors={[errors]} />}
            </Field>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
