import Link from "next/link"
import { Home } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 pt-16 pb-8 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand and Description (Takes 2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <Home className="h-6 w-6 text-white" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Travel<sup className="font-medium text-sm">™</sup>
              </span>
            </Link>
            <p className="mb-8 text-sm leading-relaxed max-w-sm">
              Discovering the right path to wellness is all about personalizing your journey. We&apos;re excited to introduce this to our wellness community.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition-colors hover:bg-zinc-700 hover:text-white">
                <span className="font-bold text-xs">Fb</span>
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition-colors hover:bg-zinc-700 hover:text-white">
                <span className="font-bold text-xs">Ig</span>
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition-colors hover:bg-zinc-700 hover:text-white">
                <span className="font-bold text-xs">Tw</span>
              </Link>
              <Link href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 transition-colors hover:bg-zinc-700 hover:text-white">
                <span className="font-bold text-xs">In</span>
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/travel-guides" className="transition-colors hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Quick Link
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/travel-guides" className="transition-colors hover:text-white">
                  Start Hiking
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-white">
                  Apply as content
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Help & Support
            </h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/help" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/community" className="transition-colors hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-8 text-center text-xs">
          <p>Copyright © {new Date().getFullYear()} Travel Guide. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
