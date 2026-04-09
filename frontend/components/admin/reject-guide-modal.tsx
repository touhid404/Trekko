"use client"

import * as React from "react"
import Modal from "@/components/modules/member/modal"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ApprovedGuide } from "@/services/admin/approved-guides.service"

interface RejectGuideModalProps {
  guide: ApprovedGuide | null
  isOpen: boolean
  onClose: () => void
  onConfirm?: (feedback: string) => Promise<void>
  isLoading?: boolean
}

export function RejectGuideModal({
  guide,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RejectGuideModalProps) {
  const [feedback, setFeedback] = React.useState("")

  const handleConfirm = async () => {
    if (!feedback.trim()) {
      alert("Please enter feedback before rejecting")
      return
    }
    await onConfirm?.(feedback)
  }

  const handleClose = () => {
    setFeedback("")
    onClose()
  }

  if (!guide) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Guide"
      size="md"
    >
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <p className="font-semibold">{guide.title}</p>
          <p className="text-sm text-muted-foreground">{guide.category.title}</p>
        </div>

        <div className="space-y-3">
          <label htmlFor="feedback" className="font-semibold block text-sm">
            Feedback <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="feedback"
            placeholder="Enter rejection reason or feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-32"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !feedback.trim()}
          >
            {isLoading ? "Rejecting..." : "Reject"}
          </Button>
        </div>
      </div>
    </Modal>
  )
}