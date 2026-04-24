export default function TrustedCompanies() {
  const companies = [
    { name: "Goodwill", icon: "🌐" },
    { name: "FocalPoint", icon: "❖" },
    { name: "Screentime", icon: "◎" },
    { name: "Segment", icon: "◒" },
    { name: "Shutterframe", icon: "⬡" },
    { name: "Mastermark", icon: "✧" },
  ]

  return (
    <section className="py-12 bg-white text-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-gray-500 mb-8">Trusted by 300+ Companies</p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale transition-all hover:grayscale-0">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-2xl text-gray-400">{company.icon}</span>
              <span className="text-xl font-bold text-gray-400 tracking-tight">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
