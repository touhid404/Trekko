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
import { registerAction } from "@/app/actions/auth/register"

export function RegisterForm({ redirectPath }: { redirectPath?: string }) {
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const registerPayload = {
          name: value.name,
          email: value.email,
          password: value.password,
        }

        const result = await registerAction(registerPayload)

        if (!result.success) {
          toast.error(result.message || "Registration failed")
          return
        }

        toast.success("Registration successful!")
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
        console.error("Registration error:", error)
        toast.error(error?.message || "An error occurred during registration")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Form */}
      <div className="flex w-full flex-col justify-center px-12 py-24 lg:w-1/2 lg:px-32">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="mb-14 inline-flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">Trekko</span>
          </Link>

          <div className="mb-14">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              Join the community
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              Create your account and start exploring curated travel guides from around the world.
            </p>
          </div>

          <form.Provider>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="space-y-5"
            >
              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Full Name
                    </FieldLabel>
                    <Input
                      placeholder="John Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm transition-colors focus:border-gray-900 focus:bg-white focus:ring-0"
                    />
                  </Field>
                )}
              </form.Field>

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
                  </Field>
                )}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => (
                  <Field>
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm transition-colors focus:border-gray-900 focus:bg-white focus:ring-0"
                    />
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
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </form.Provider>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-gray-900 transition-colors hover:text-black"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right Panel — Immersive Travel Visual (mirrored) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1400')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

        <div className="relative z-10 flex h-full flex-col justify-between p-14">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 self-end">
            <span className="text-xl font-black tracking-tight text-white">Trekko</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
              <Compass className="h-5 w-5 text-white" />
            </div>
          </Link>

          {/* Quote */}
          <div className="max-w-md self-end text-right">
            <blockquote className="text-3xl font-black leading-tight tracking-tight text-white">
              &ldquo;Travel makes one modest. You see what a tiny place you occupy in the world.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-bold text-white/40 uppercase tracking-widest">
              — Gustave Flaubert
            </p>
          </div>

          {/* Features */}
          <div className="flex gap-8 self-end">
            {["Curated Guides", "Verified Locals", "Offline Access"].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
