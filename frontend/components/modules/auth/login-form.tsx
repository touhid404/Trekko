/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import Link from "next/link"
import { Compass, ArrowRight, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/app/actions/auth/login"
import { googleLoginAction } from "@/app/actions/auth/googleLogin"

export function LoginForm({ redirectPath }: { redirectPath?: string }) {
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const result = await loginAction(value, redirectPath)

        if (!result.success) {
          toast.error(result.message || "Login failed")
          return
        }

        toast.success("Login successful!")
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
        console.error("Login error:", error)
        toast.error(error?.message || "An error occurred during login")
      } finally {
        setLoading(false)
      }
    },
  })

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await googleLoginAction(redirectPath)
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
      console.error("Google login error:", error)
      toast.error(error?.message || "Google login failed")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Immersive Travel Visual */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Trekko</span>
          </Link>

          {/* Quote */}
          <div className="max-w-md">
            <blockquote className="text-3xl font-black leading-tight tracking-tight text-white">
              &ldquo;The world is a book, and those who do not travel read only one page.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-bold text-white/40 uppercase tracking-widest">
              — Saint Augustine
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-black text-white">30+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Curated Guides</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">8</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Authentic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full flex-col justify-center px-12 py-24 lg:w-1/2 lg:px-32">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="mb-14 inline-flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Trekko</span>
          </Link>

          <div className="mb-14">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Welcome back
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Sign in to access your travel collections and curated guides.
            </p>
          </div>

          <form.Provider>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-6"
            >
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Email Address
                    </FieldLabel>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm transition-colors focus:border-gray-900 focus:bg-white focus:ring-0"
                    />
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 pr-12 text-sm transition-colors focus:border-gray-900 focus:bg-white focus:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError errors={field.state.meta.errors.map(String)} />
                  </Field>
                )}
              </form.Field>

              <Button
                type="submit"
                disabled={loading}
                className="group h-12 w-full rounded-xl bg-gray-900 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-black"
                size="lg"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </form.Provider>

          <div className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-gray-900 transition-colors hover:text-black"
            >
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
