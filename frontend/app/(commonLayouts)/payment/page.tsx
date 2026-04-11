"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Loader2, AlertCircle, ChevronRight, Globe } from "lucide-react"
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
    <div className="relative min-h-screen bg-gray-50 text-gray-900 selection:bg-blue-400 selection:text-white">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-multiply scale-105 blur-[2px]"
          style={{ backgroundImage: `url(${guide.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=2000'})` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-gray-50/95 via-gray-50/80 to-gray-50" />
        <div className="absolute inset-0 bg-linear-to-r from-gray-50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group mb-12 flex items-center gap-4 text-[10px] font-black tracking-widest uppercase text-gray-500 transition-colors hover:text-gray-900"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors group-hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Abort Checkout
        </button>

        <div className="grid gap-16 lg:grid-cols-12">
          {/* Layout: Info */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
                <div className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-700">
                  Premium Exploration Access
                </span>
              </div>

              <h1 className="text-6xl font-black leading-[0.9] tracking-tighter sm:text-7xl">
                Secure your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                  Passport.
                </span>
              </h1>

              <p className="max-w-md text-lg font-light leading-relaxed text-gray-500">
                Unlock expert insights, hidden paths, and local secrets for <span className="text-gray-900 font-bold">&quot;{guide.title}&quot;</span>.
              </p>
            </div>

            {/* Travel Guide Pass (Card) */}
            <div className="relative overflow-hidden rounded-[3rem] border border-gray-100 bg-white shadow-xl transition-transform hover:scale-[1.01] duration-700 hover:shadow-2xl">
              <div className="flex flex-col md:flex-row overflow-hidden rounded-[3rem] bg-white">
                <div className="relative h-64 md:h-auto md:w-5/12 overflow-hidden bg-gray-100">
                  <img
                    src={guide.coverImage || 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?auto=format&fit=crop&q=80&w=1200'}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition-all duration-1000 hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-gray-900/10 to-transparent" />
                </div>

                <div className="flex-1 p-10 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                      <Globe className="h-3 w-3" />
                      {guide.category.title}
                    </div>
                    <h3 className="text-3xl font-black tracking-tight leading-tight text-gray-900">
                      {guide.title}
                    </h3>
                  </div>

                  <div className="mt-12 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl border border-gray-200 bg-gray-50 p-0.5">
                      <img
                        src={guide.member?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${guide.member?.name}`}
                        className="h-full w-full rounded-2xl object-cover"
                        alt=""
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Curator</p>
                      <p className="text-sm font-bold text-gray-900">{guide.member?.name || "Global Explorer"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aesthetic Elements */}
              <div className="absolute top-8 right-8 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-gray-300 text-[10px] font-black bg-white shadow-sm">
                TK-77
              </div>
            </div>

            {/* End of Guide Pass */}
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="rounded-[3rem] border border-gray-100 bg-white p-10 shadow-2xl shadow-gray-200/50">
                <h3 className="mb-10 text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 text-center">
                  Manifest Summary
                </h3>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900">{guide.title}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Standard Membership License</p>
                    </div>
                    <span className="text-xl font-black text-gray-900">
                      ${guide?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="space-y-4">
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <span>Access Fee</span>
                      <span>${guide?.price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <span>Processing</span>
                      <span className="text-emerald-500">Included</span>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Investment</p>
                      <p className="text-3xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-gray-900 to-gray-600">Amount</p>
                    </div>
                    <span className="text-5xl font-black tracking-tighter text-gray-900">
                      ${guide?.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="mt-12 group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-2xl bg-gray-900 px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Confirm and Unlock
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="mt-10 flex items-center justify-center gap-8 opacity-40 grayscale transition-opacity hover:opacity-100">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="" className="h-3" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="" className="h-5" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="" className="h-5" />
                </div>
              </div>

              {/* Guarantee */}
              <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                Instant Access Granted Post-Validation
              </p>
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
