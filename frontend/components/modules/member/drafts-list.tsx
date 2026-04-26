/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  getDrafts,
  DraftGuide,
  IQueryResult,
} from "@/app/actions/member/get-drafts"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { submitGuideForReview } from "@/app/actions/member/update-guide-status"
import { toast } from "sonner"
import { deleteDraft } from "@/app/actions/member/delete-draft"
import { Pagination } from "@/components/shared/Pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileText, FileEdit, Send, Trash2, MapPin } from "lucide-react"
import Image from "next/image"
import EditDraftModal from "@/components/modules/member/edit-draft-modal"
import ViewDraftModal from "@/components/modules/member/view-draft-modal"
import ConfirmationModal from "@/components/modules/member/confirmation-modal"
import { Badge } from "@/components/ui/badge"

interface DraftsListProps {
  initialData: IQueryResult<DraftGuide>
}

export default function DraftsList({ initialData }: DraftsListProps) {
  const [data, setData] = useState<IQueryResult<DraftGuide>>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Modal tracking
  const [selectedGuide, setSelectedGuide] = useState<DraftGuide | null>(null)
  const [modalType, setModalType] = useState<"view" | "edit" | "submit" | "delete" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handlePageChange = async (page: number) => {
    setIsLoading(true)
    try {
      const response = await getDrafts(page, 10)
      setData(response.data)
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Failed to fetch drafts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (guide: DraftGuide, type: "view" | "edit" | "submit" | "delete") => {
    setSelectedGuide(guide)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setTimeout(() => {
      setSelectedGuide(null)
    }, 200)
  }

  const handleConfirmSubmit = async () => {
    if (!selectedGuide) return
    setIsSubmitting(true)
    try {
      const updatedGuide = await submitGuideForReview(selectedGuide.id)
      toast.success("Guide submitted for review successfully!")
      
      const updatedGuides = data.data.map((g) =>
        g.id === selectedGuide.id ? updatedGuide : g
      )
      setData((prev) => ({
        ...prev,
        data: updatedGuides,
      }))
      handleCloseModal()
    } catch (error: any) {
      console.error("Failed to submit guide:", error)
      toast.error(
        error?.response?.data?.message || "Failed to submit guide for review"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSave = (updatedGuide: DraftGuide) => {
    const updatedGuides = data.data.map((g) => (g.id === updatedGuide.id ? updatedGuide : g))
    setData((prev) => ({
      ...prev,
      data: updatedGuides,
    }))
    handleCloseModal()
  }

  const handleConfirmDelete = async () => {
    if (!selectedGuide) return
    setIsDeleting(true)
    try {
      await deleteDraft(selectedGuide.id)
      toast.success("Draft deleted successfully")
      setData((prev) => ({
        ...prev,
        data: prev.data.filter((g) => g.id !== selectedGuide.id),
        meta: {
          ...prev.meta,
          total: prev.meta.total - 1,
        },
      }))
      handleCloseModal()
    } catch (error: any) {
      console.error("Failed to delete draft:", error)
      toast.error(error?.message || "Failed to delete draft")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-24 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
          <FileEdit className="h-8 w-8" />
        </div>
        <p className="mb-2 text-lg font-bold text-slate-900">
          No draft guides yet
        </p>
        <p className="text-sm font-medium text-slate-500">
          Start creating your first travel guide to see it here
        </p>
      </div>
    )
  }

  const { data: guides, meta } = data

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[45%]">Guide</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="w-[15%]">Price</TableHead>
              <TableHead className="w-[15%]">Last Modified</TableHead>
              <TableHead className="text-right w-[10%]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guides.map((guide) => (
              <TableRow key={guide.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                      {guide.coverImage ? (
                        <Image
                          src={guide.coverImage}
                          alt={guide.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <MapPin className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="max-w-md truncate font-bold text-sm text-slate-900">
                        {guide.title}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-1 max-w-sm">
                        {guide.description || "No description provided"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                    {guide.category?.title || 'General'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-bold text-slate-900">
                  {guide.isPaid ? `$${guide.price.toFixed(2)}` : "Free"}
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-600">
                  {new Date(guide.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-slate-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={() => handleOpenModal(guide, "view")}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenModal(guide, "edit")}>
                        <FileEdit className="mr-2 h-4 w-4" /> Edit Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenModal(guide, "submit")}>
                        <Send className="mr-2 h-4 w-4" /> Submit Review
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenModal(guide, "delete")} className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 border-t border-slate-100 mt-1">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Draft
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages >= 1 && (
        <div className="flex flex-col items-center gap-4 pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
          {meta.total > 0 && (
            <div className="text-xs font-semibold text-slate-400">
              Showing {(currentPage - 1) * meta.limit + 1} to{" "}
              {Math.min(currentPage * meta.limit, meta.total)} of {meta.total} drafts
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedGuide && (
        <>
          <ViewDraftModal
            guide={selectedGuide}
            isOpen={modalType === "view"}
            onClose={handleCloseModal}
          />
          <EditDraftModal
            guide={selectedGuide}
            isOpen={modalType === "edit"}
            onClose={handleCloseModal}
            onSave={handleEditSave}
          />
          <ConfirmationModal
            isOpen={modalType === "submit" || modalType === "delete"}
            onClose={handleCloseModal}
            onConfirm={modalType === "submit" ? handleConfirmSubmit : handleConfirmDelete}
            title={modalType === "submit" ? "Submit Guide for Review" : "Delete Draft"}
            description={
              modalType === "submit"
                ? "Are you sure you want to submit this guide for review? Once submitted, it will be reviewed by moderators."
                : "Are you sure you want to delete this draft? This action cannot be undone."
            }
            confirmText={modalType === "submit" ? "Yes, Submit" : "Yes, Delete"}
            cancelText="Cancel"
            isLoading={modalType === "submit" ? isSubmitting : isDeleting}
          />
        </>
      )}
    </div>
  )
}
