import Hero from "@/components/modules/home/hero"
import SearchSection from "@/components/home/SearchSection"
import FeaturedGuides from "@/components/home/FeaturedGuides"
import PopularCategories from "@/components/home/PopularCategories"
import HowItWorks from "@/components/home/HowItWorks"
import Testimonials from "@/components/home/Testimonials"
import Newsletter from "@/components/home/Newsletter"
import travelGuideServices from "@/services/travelGuide/travelGuide.service"

export default async function Home() {
  const response = await travelGuideServices.getTopVotedGuides()
  const guides =
    response.success && response.data ? response.data.slice(0, 5) : []

  return (
    <div className="bg-background">
      <Hero />
      <SearchSection />
      <FeaturedGuides guides={guides} />
      <PopularCategories />
      <HowItWorks />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
