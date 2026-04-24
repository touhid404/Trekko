"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-24 selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-2xl">
        {/* Cancel Message */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 text-center relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-red-500" />
          
          <div className="p-10 md:p-14">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-500 shadow-inner">
                <AlertCircle className="h-10 w-10" />
              </div>
            </div>

            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900">
              Payment Cancelled
            </h1>
            <p className="text-sm font-medium leading-relaxed text-gray-500">
              The transaction process was terminated. No charges have been made to your account.
            </p>
          </div>

          <div className="bg-gray-50/50 p-10 text-left border-t border-gray-100">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">Status Update</h3>
            <p className="text-sm font-medium leading-relaxed text-gray-500">
              Your requested guide remains saved in our secure systems. You may re-initialize the transaction at your convenience whenever you are ready.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => router.back()}
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-gray-900 text-sm font-bold text-white transition-all hover:bg-black active:scale-95 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
          >
            <RotateCcw className="h-4 w-4" />
            Retry Payment
          </button>
          <Link
            href="/travel-guides"
            className="flex h-14 items-center justify-center gap-3 rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Library
          </Link>
        </div>

        {/* Support */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-gray-900 transition-colors">Support Center</Link>
            <Link href="/about-us" className="hover:text-gray-900 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </div>
  )
}