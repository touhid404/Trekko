"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do I book a trip on Magnolia?",
      answer: "After finding your desired flight, hotel or activity, simply follow the on-screen prompts to select your dates, number of travelers, and any additional preferences. Then proceed to the secure payment gateway to confirm your booking."
    },
    { question: "Does Magnolia offer travel insurance?", answer: "Yes, we offer comprehensive travel insurance options during the checkout process." },
    { question: "Does Magnolia provide travel recommendations?", answer: "Absolutely. Our expert curators constantly update our travel guides and destination highlights to provide tailored suggestions for every season." },
    { question: "Do you offer discount for group bookings?", answer: "Yes, group bookings of 10 or more travelers are eligible for automatic discounts." },
    { question: "Can I cancel or reschedule my trip?", answer: "Cancellation and rescheduling policies vary by provider. You can manage your bookings directly from your dashboard." }
  ]

  return (
    <section className="py-20 bg-[#FAFAFA]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm text-gray-500">
            FAQs address common inquiries and provide essential information, helping users find solutions quickly.
          </p>
        </div>

        <div className="space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white rounded-2xl p-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index} className={`border rounded-xl transition-colors ${isOpen ? 'border-transparent bg-black pb-4' : 'border-gray-200 bg-white'}`}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className={`text-sm font-bold ${isOpen ? 'text-white' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 text-sm text-gray-400">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
