import Hero from "@/components/modules/home/hero"
import SearchSection from "@/components/home/SearchSection"
import TrustedCompanies from "@/components/home/TrustedCompanies"
import FeaturedGuides from "@/components/home/FeaturedGuides"
import FAQ from "@/components/home/FAQ"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRandomGuides(guides: any[], count: number) {
  const allGuides = [...guides]
  for (let i = allGuides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allGuides[i], allGuides[j]] = [allGuides[j], allGuides[i]]
  }
  return allGuides.slice(0, count)
}

export default async function Home() {
  // Fetch up to 50 guides to have a large pool to randomize from
  const response = await travelGuideServices.getAll(1, 50)
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let guides: any[] = []
  if (response.success && response.data?.data) {
    guides = getRandomGuides(response.data.data, 4)
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <SearchSection />
      <TrustedCompanies />
      <FeaturedGuides guides={guides} />
      {/* We can place Popular Destiniations here if needed, skip for now to match core mockup */}
      <FAQ />
    </div>
  )
}
