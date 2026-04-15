"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PenLine, ImagePlus, Send, X } from "lucide-react"
import { createBlogAction } from "@/actions/blog/blogActions"

interface Props {
  userName?: string
}

export default function CreateBlogForm({ userName }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    const toastId = toast.loading("Publishing your post...")
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      if (coverImage) formData.append("coverImage", coverImage)

      const result = await createBlogAction(formData)

      if (result.success) {
        setTitle("")
        setContent("")
        setCoverImage("")
        setIsExpanded(false)
        setShowImageInput(false)
        toast.success("Post published!", { id: toastId })
        router.refresh()
      } else {
        toast.error(result.message || "Failed to publish", { id: toastId })
      }
    } catch {
      toast.error("Something went wrong", { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex w-full items-center gap-4 p-5"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
            {userName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 rounded-full bg-gray-50 px-5 py-3 text-left text-sm text-gray-400 transition-colors hover:bg-gray-100">
            What&apos;s on your mind, {userName?.split(" ")[0] || "traveler"}?
          </div>
          <PenLine className="h-5 w-5 text-gray-400" />
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{userName || "You"}</p>
                <p className="text-[11px] text-gray-400">Publishing to Blog</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="mb-3 w-full border-b border-gray-100 pb-3 text-lg font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none"
            required
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your travel story, tips, or experiences..."
            className="min-h-[120px] w-full resize-none text-[15px] leading-relaxed text-gray-700 placeholder:text-gray-300 focus:outline-none"
            required
          />

          {showImageInput && (
            <div className="mt-3 flex items-center gap-2">
              <input
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Paste cover image URL..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => { setShowImageInput(false); setCoverImage("") }}
                className="rounded-full p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <ImagePlus className="h-4 w-4 text-emerald-500" />
              Photo
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
