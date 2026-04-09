import { Navbar } from "@/components/navber/navber"
import { getUserInfo } from "@/services/auth.service"

export default async function NavbarWrapper() {
  const userInfo = await getUserInfo()

  return <Navbar userInfo={userInfo} />
}
