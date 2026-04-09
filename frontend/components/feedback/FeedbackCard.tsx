"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import swal from "sweetalert"

import { submitGuideForReview } from "@/app/actions/member/update-guide-status"
import EditDraftModal from "@/components/modules/member/edit-draft-modal"

interface Guide {
  id: string
  title: string
  description: string
  status: string
  // add more
}

interface FeedbackCardProps {
  feedback: string
  guide: Guide
}

export function FeedbackCard({ feedback, guide }: FeedbackCardProps) {
  const router = useRouter()
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const confirmed = await swal({
      title: "Submit for review?",
      text: "This action will submit the guide again for admin review.",
      icon: "warning",
      buttons: ["Cancel", "Submit"],
      dangerMode: true,
    })

    if (!confirmed) return

    try {
      setIsSubmitting(true)
      await submitGuideForReview(guide.id)
      router.refresh()
      toast.success("Guide submitted for review successfully")
    } catch (error: any) {
      console.error("Failed to submit guide", error)
      toast.error(error?.message || "Failed to submit guide")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{guide.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{guide.description}</p>

        <div className="flex gap-2">
          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">View Feedback</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogTitle>Admin Feedback</DialogTitle>
              <DialogDescription>
                Feedback for guide: {guide.title}
              </DialogDescription>

              <p>{feedback}</p>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setEditOpen(true)}>
            Edit
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || guide.status === "UNDER_REVIEW"}
          >
            {isSubmitting
              ? "Submitting..."
              : guide.status === "UNDER_REVIEW"
                ? " Under Review"
                : "Submit"}
          </Button>
        </div>

        <EditDraftModal
          guide={guide as any} // cast if needed
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={(updatedGuide) => {
            toast.success("Guide updated locally")
            setEditOpen(false)
            router.refresh()
          }}
        />
      </CardContent>
    </Card>
  )
}
