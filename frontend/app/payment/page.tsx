"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Loader2, AlertCircle, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"
import { initiatePaymentAction } from "@/actions/payment/initiatePaymentAction"

interface GuideDetails {
  id: string
  title: string
  description: string
  price: number
  category: {
    title: string
  }
  member?: {
    name: string
    image?: string
  }
  coverImage?: string
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const guideId = searchParams.get("guideId")

  const [guide, setGuide] = useState<GuideDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGuide = async () => {
      if (!guideId) {
        setError("No guide ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await travelGuideServices.getById(guideId)

        if (response.success && response.data) {
          setGuide(response.data as GuideDetails)
        } else {
          setError("Failed to fetch guide details")
        }
      } catch (err: unknown) {
        console.error("Error fetching guide:", err)
        setError("Failed to load guide information")
      } finally {
        setLoading(false)
      }
    }

    fetchGuide()
  }, [guideId])

  const handlePayment = async () => {
    if (!guideId) {
      toast.error("Guide ID is missing")
      return
    }

    setProcessing(true)
    try {
      const formData = new FormData()
      formData.append("guideId", guideId)

      const result = await initiatePaymentAction(formData)

      if (result.success && result.data?.checkoutUrl) {
        toast.success("Redirecting to secure payment...")
        window.location.href = result.data.checkoutUrl
      } else {
        toast.error(result.message || "Failed to initiate payment")
        setError(result.message || "Failed to initiate payment")
      }
    } catch (err: unknown) {
      console.error("Payment error:", err)
      toast.error("An error occurred during payment")
      setError("An error occurred during payment")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-gray-900">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
            Authenticating your journey...
          </p>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 text-gray-900">
        <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-xl transition-all duration-500">
          <div className="p-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="mb-4 text-2xl font-black tracking-tight uppercase">
              System Interruption
            </h2>
            <p className="mb-8 leading-relaxed text-gray-500">
              {error || "We encountered an unexpected error while retrieving your travel guide."}
            </p>
            <button
              onClick={() => router.back()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-black active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Catalog
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-gray-900 selection:bg-emerald-500/30">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 lg:px-8">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group mb-12 flex items-center gap-3 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 transition-transform group-hover:-translate-x-1">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Return to Details
        </button>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Layout: Info */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 border border-emerald-100">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Secure Checkout
                </span>
              </div>

              <h1 className="text-4xl font-black tracking-tight sm:text-6xl text-gray-900 mb-6">
                Unlock Your <br className="hidden sm:block" />
                <span className="text-emerald-500">Journey.</span>
              </h1>

              <p className="max-w-md text-base leading-relaxed text-gray-500">
                Gain immediate access to verified coordinates, high-fidelity itineraries, and localized secrets for &quot;{guide.title}&quot;.
              </p>
            </div>

          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-10">
              <div className="rounded-3xl bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                <h3 className="mb-8 text-xl font-bold tracking-tight text-gray-900">
                  Order Summary
                </h3>

                <div className="space-y-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-bold text-gray-900 line-clamp-2 leading-tight">{guide.title}</p>
                      <p className="mt-1 text-sm font-medium text-gray-500">Premium Access License</p>
                    </div>
                    <span className="text-xl font-bold text-gray-900 whitespace-nowrap">
                      ৳{guide?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900">৳{guide?.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-500">
                      <span>Platform Fee</span>
                      <span className="text-emerald-500 font-bold">Waived</span>
                    </div>
                  </div>

                  <div className="pt-6 flex items-end justify-between border-t border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Payment</p>
                    </div>
                    <span className="text-4xl font-black tracking-tight text-gray-900">
                      ৳{guide?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="mt-10 group relative flex h-14 w-full items-center justify-center gap-3 rounded-full bg-gray-900 text-sm font-bold text-white transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Securely Validating...
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                  <div className="text-xs font-bold tracking-widest text-gray-500">SECURE</div>
                  <div className="text-xs font-bold tracking-widest text-gray-500">ENCRYPTED</div>
                  <div className="text-xs font-bold tracking-widest text-gray-500">STRIPE</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
      }
    >
      <PaymentContent />
    </React.Suspense>
  )
}
