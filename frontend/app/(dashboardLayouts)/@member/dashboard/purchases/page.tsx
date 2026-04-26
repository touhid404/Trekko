/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { getPurchases } from "@/actions/purchases/getPurchasesAction"
import { PurchasesTable } from "@/components/purchases/PurchasesTable"
import { Loader2 } from "lucide-react"

interface Guide {
  id: string
  title: string
  category: {
    title: string
  }
  price: number
  createdAt: string
}

export default function PurchasesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchPurchases = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getPurchases(page, 10)
      if (result.success) {
        const data = (result as any).data || []
        const meta = (result as any).meta || {
          totalPages: 1,
          total: data.length,
        }
        setGuides(data)
        setTotalPages(meta.totalPages)
        setTotal(meta.total)
        setCurrentPage(page)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("Failed to fetch purchases")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPurchases(1)
  }, [])

  const handlePageChange = (page: number) => {
    fetchPurchases(page)
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-rose-500">
            Error
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Purchase History</h1>
          <p className="mt-2 text-sm font-medium text-gray-500">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Transactions
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Purchase History</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          A comprehensive registry of your acquired guides
        </p>
      </div>
          {isLoading && guides.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <PurchasesTable
              guides={guides}
              totalPages={totalPages}
              total={total}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
    </div>
  )
}
