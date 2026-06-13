import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import {
  LandingHero,
  ImpactStats,
  HowItWorks,
  LandingCTA,
} from "@/components/landing-sections"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />
      <main className="flex-1">
        <LandingHero />
        <ImpactStats />
        <HowItWorks />
        <LandingCTA />
      </main>
      <SiteFooter />
    </div>
  )
}
