"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    const verifySession = async () => {
      if (!sessionId) return;
      try {
        const { httpClient } = await import("@/lib/axios/httpClient")
        await httpClient.post("/payments/verify-session", { sessionId })
        // Auto-redirect to My Purchases dashboard page
        setTimeout(() => {
          router.push("/dashboard/purchases")
        }, 3000)
      } catch (error) {
        console.error("Failed to verify session", error)
      }
    }

    verifySession()
  }, [sessionId, router])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 selection:bg-emerald-400 selection:text-white flex items-center justify-center p-4">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-linear-to-b from-gray-50 via-emerald-50/20 to-gray-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="overflow-hidden rounded-[3rem] border border-gray-200 bg-white shadow-2xl shadow-emerald-500/5 text-center">

          <div className="p-12 md:p-16">
            <div className="mx-auto mb-10 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 border border-emerald-100">
                <div className="absolute inset-0 animate-ping rounded-[2rem] bg-emerald-400/20 opacity-50"></div>
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter text-gray-900">
                Payment Authorized
              </h1>
              <p className="text-sm font-light leading-relaxed text-gray-500">
                Your transaction was completed successfully. Your manifest has been updated and access is now granted.
              </p>
            </div>

            {sessionId && (
              <div className="mt-10 rounded-[2rem] border border-dashed border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Transaction Token
                </span>
                <span className="font-mono text-sm tracking-tight text-gray-600 break-all">
                  {sessionId}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                Redirecting to your dashboard...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  )
}
