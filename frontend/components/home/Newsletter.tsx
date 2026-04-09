"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, Send } from "lucide-react"
import { toast } from "sonner"
import { subscribeNewsletterAction } from "@/actions/newsletter/newsletter.action"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const subscribedEmail = localStorage.getItem("subscribedEmail")
    if (subscribedEmail) {
      setIsSubscribed(true)
      setEmail(subscribedEmail)
    }
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const result = await subscribeNewsletterAction(email)

      if (result.success) {
        localStorage.setItem("subscribedEmail", email)
        setIsSubscribed(true)
        setEmail("")
        toast.success(
          result.message || "Successfully subscribed to our newsletter!"
        )
      } else {
        toast.error(result.message || "Failed to subscribe. Please try again.")
      }
    } catch {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-black p-10 text-center md:p-16">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Mail className="h-7 w-7 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Stay Updated
            </h2>

            <p className="mt-3 text-sm text-white/60 max-w-md mx-auto">
              Get the latest travel guides, top-voted destinations, and
              exclusive tips delivered to your inbox.
            </p>

            {isSubscribed ? (
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  You&apos;re all set!
                </h3>
                <p className="text-sm text-white/60">
                  Thank you for subscribing. Check your email for confirmation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-8">
                <div className="mx-auto flex max-w-md gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 rounded-full border-white/20 bg-white/10 px-6 py-6 text-sm text-white placeholder:text-white/40 focus-visible:ring-white/30"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-white text-black transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}

            <p className="mt-6 text-[11px] text-white/40">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
