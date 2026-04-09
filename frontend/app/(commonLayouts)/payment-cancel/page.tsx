"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Cancel Message */}
        <div className="mb-8 rounded-lg bg-white p-8 text-center shadow-lg md:p-12">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <AlertCircle className="h-12 w-12 text-amber-600" />
            </div>
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            Payment Cancelled
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Your payment was not completed. No charges have been made to your
            account.
          </p>

          {/* Reason Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 font-semibold text-amber-900">
                What happened?
              </h3>
              <p className="text-sm text-amber-800">
                You cancelled the payment or the checkout session expired. Your
                purchase was not completed.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Good news!</h3>
              <p className="text-sm text-blue-800">
                You can try again anytime. Your purchase record has been saved
                for reference.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6 text-left">
            <h3 className="mb-4 font-semibold text-green-900">Payment Tips</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">•</span>
                <span>Make sure you have sufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">•</span>
                <span>Check that your card details are entered correctly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">•</span>
                <span>Ensure your card is not blocked or restricted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">•</span>
                <span>
                  Contact your bank if you suspect fraud or security issues
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <RotateCcw className="h-5 w-5" />
            Try Payment Again
          </button>
          <Link
            href="/travel-guides"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>

        {/* FAQ */}
        <div className="rounded-lg bg-white p-6 shadow-lg md:p-8">
          <h3 className="mb-6 text-lg font-bold text-gray-900">
            Common Issues & Solutions
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Why was my payment declined?
              </h4>
              <p className="text-gray-600">
                Common reasons include insufficient funds, incorrect card
                information, card expiration, or your bank blocking the
                transaction. Contact your bank for more details.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Will I be charged for a failed payment?
              </h4>
              <p className="text-gray-600">
                No. You will only be charged if your payment is successfully
                completed. Failed or cancelled transactions are not charged.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                How long can I keep my purchase reservation?
              </h4>
              <p className="text-gray-600">
                Your purchase record is saved for 30 minutes. After that, you
                would need to initiate a new payment session.
              </p>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                What payment methods are accepted?
              </h4>
              <p className="text-gray-600">
                We accept all major credit and debit cards (Visa, Mastercard,
                American Express, etc.) processed through Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center text-gray-600">
          <p className="mb-2">Still having issues?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Contact Support
            </Link>
            <span className="text-gray-400">•</span>
            <Link
              href="/about-us"
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
