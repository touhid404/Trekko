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
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-foreground" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-emerald-500/30 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-500" />
          
          <div className="p-12 md:p-16 text-center">
            <div className="mx-auto mb-8 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 shadow-inner">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                Payment Successful
              </h1>
              <p className="text-sm font-medium leading-relaxed text-gray-500">
                The transaction has been securely authorized. Your high-fidelity travel guide itinerary is now permanently unlocked in your repository.
              </p>
            </div>

            {sessionId && (
              <div className="mt-10 rounded-2xl bg-gray-50 p-6 flex flex-col items-center gap-2 border border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Transaction Reference
                </span>
                <span className="font-mono text-xs tracking-tight text-gray-900 break-all bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                  {sessionId}
                </span>
              </div>
            )}
          </div>

          <div className="bg-emerald-50/50 p-8 border-t border-emerald-100/50">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                Preparing your itinerary...
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
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  )
}
