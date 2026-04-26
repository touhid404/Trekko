/* eslint-disable @typescript-eslint/no-explicit-any */
import { MembersList } from "@/components/admin/members-list"
import { getMembersAction } from "@/app/actions/admin/getMembersAction"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function MembersPage({ searchParams }: PageProps) {
  const page = parseInt((searchParams.page as string) || "1")
  const searchTerm = (searchParams.searchTerm as string) || ""
  const sort = (searchParams.sort as string) || "all"
  const role = (searchParams.role as string) || "all"
  const status = (searchParams.status as string) || "all"

  const filterObj: Record<string, string> = {}
  if (role !== "all") {
    filterObj["role"] = role
  }
  if (status !== "all") {
    filterObj["status"] = status
  }

  const sortValue = sort !== "all" ? sort : undefined

  const result = await getMembersAction(
    page,
    10,
    sortValue,
    searchTerm || undefined,
    filterObj
  )

  const initialMembers = (result?.data as any) || result?.data || []
  const initialTotalPages = result?.meta?.totalPages || 0
  const initialTotal = result?.meta?.total || 0

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <span className="mb-2 inline-block text-xs font-bold uppercase tracking-widest text-emerald-500">
          Community
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Member Management</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          Activate/deactivate accounts and manage member roles
        </p>
      </div>

        <MembersList
          initialMembers={initialMembers}
          initialTotalPages={initialTotalPages}
          initialTotal={initialTotal}
          initialPage={page}
        />
    </div>
  )
}
