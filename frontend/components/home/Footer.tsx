import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 text-foreground border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-5">
          {/* Brand and Description (Takes 2 cols) */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-8 flex items-center gap-2">
              <span className="text-3xl font-extrabold tracking-tighter">
                TREKKO.
              </span>
            </Link>
            <p className="mb-10 text-sm font-medium leading-relaxed max-w-xs opacity-70">
              Redefining the art of discovery. We provide high-fidelity chronicles for the modern explorer seeking authenticity and precision.
            </p>
            <div className="flex gap-6">
              {['FB', 'IG', 'TW', 'LI'].map((social) => (
                <Link key={social} href="#" className="text-[10px] font-black tracking-widest hover:underline underline-offset-4">
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em]">
              Archive
            </h3>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-wider">
              <li><Link href="/" className="hover:underline underline-offset-4">Home</Link></li>
              <li><Link href="/travel-guides" className="hover:underline underline-offset-4">Chronicles</Link></li>
              <li><Link href="/blog" className="hover:underline underline-offset-4">Insights</Link></li>
              <li><Link href="/faq" className="hover:underline underline-offset-4">Manifesto</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em]">
              Connect
            </h3>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-wider">
              <li><Link href="/travel-guides" className="hover:underline underline-offset-4">Explore</Link></li>
              <li><Link href="/dashboard" className="hover:underline underline-offset-4">Dashboard</Link></li>
              <li><Link href="/contact" className="hover:underline underline-offset-4">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.2em]">
              Support
            </h3>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-wider">
              <li><Link href="/help" className="hover:underline underline-offset-4">Assistance</Link></li>
              <li><Link href="/community" className="hover:underline underline-offset-4">Network</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-24 border-t border-border pt-10 text-center text-[10px] font-black uppercase tracking-[0.3em]">
          <p>© {new Date().getFullYear()} TREKKO SYSTEM. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  )
}
