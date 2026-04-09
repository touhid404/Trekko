import Footer from "@/components/home/Footer"
import NavbarWrapper from "@/components/navber/NavbarWrapper"

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  )
}
