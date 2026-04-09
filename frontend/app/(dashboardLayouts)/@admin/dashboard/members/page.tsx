import { MembersList } from "@/components/admin/members-list"
import { getMembersAction } from "@/app/actions/admin/getMembersAction"
import { Member } from "@/services/admin/members.service"

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="mt-2 text-muted-foreground">
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
    </div>
  )
}
