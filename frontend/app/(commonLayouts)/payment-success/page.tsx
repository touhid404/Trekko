"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Home, Loader2 } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Success Message */}
        <div className="mb-8 rounded-lg bg-white p-8 text-center shadow-lg md:p-12">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-green-200"></div>
              <CheckCircle className="relative h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Payment Successful!
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>

          {sessionId && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="mb-1 text-sm text-gray-500">Session ID</p>
              <p className="font-mono text-sm break-all text-gray-900">
                {sessionId}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 text-left">
            <h3 className="mb-4 font-semibold text-blue-900">What&apos;s next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Check your email for a confirmation receipt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Access the guide from your profile or dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Start exploring the travel guide content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Share your feedback with the community</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/dashboard/purchases"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowRight className="h-5 w-5" />
            Go to My Purchases
          </Link>
          <Link
            href="/travel-guides"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-300"
          >
            <Home className="h-5 w-5" />
            Browse More Guides
          </Link>
        </div>

        {/* FAQ */}
        <div className="mt-12 rounded-lg bg-white p-6 shadow-lg md:p-8">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                When will I get access to the guide?
              </h4>
              <p className="text-gray-600">
                You should have instant access to the guide after successful
                payment. Check your profile or email for download links.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Can I download the guide?
              </h4>
              <p className="text-gray-600">
                Yes! You can download the guide from your profile dashboard
                anytime. It will be available in your account indefinitely.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Is there a refund policy?
              </h4>
              <p className="text-gray-600">
                Please check our refund policy in the terms and conditions. Most
                refunds are processed within 7-10 business days.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Do you offer subscriptions?
              </h4>
              <p className="text-gray-600">
                Currently, we offer one-time purchases. Subscription options may
                be coming soon. Follow our blog for updates!
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Need help?</p>
          <Link
            href="/"
            className="font-medium text-blue-600 transition hover:text-blue-700"
          >
            Contact Support
          </Link>
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
