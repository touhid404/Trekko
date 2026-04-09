import { getCategories } from "@/app/actions/member/getCateforisAction"
import { CreateGuideForm } from "@/components/modules/member/create-guide-form"

export default async function CreateGuidePage() {
  const categories = await getCategories()

  return <CreateGuideForm categories={categories} />
}
