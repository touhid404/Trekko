import { LoginForm } from "@/components/modules/auth/login-form"

export const dynamic = "force-dynamic"

interface ILoginPageProps {
  searchParams?: Promise<{
    redirect?: string
  }>
}

export default async function LoginPage({ searchParams }: ILoginPageProps) {
  const params = await searchParams
  const redirectPath = params?.redirect
  return <LoginForm redirectPath={redirectPath} />
}
