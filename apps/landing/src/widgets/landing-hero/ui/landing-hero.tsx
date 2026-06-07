import { CtaSection } from './sections/cta-section';
import { DiarySection } from './sections/diary-section';
import { DirectionsSection } from './sections/directions-section';
import { FeaturesSection } from './sections/features-section';
import { HeroSection } from './sections/hero-section';
import { HowSection } from './sections/how-section';
import { MarketIndicesStrip } from '../../market-indices-strip';

/** Matches PublicShell header `h-14` for viewport math */
const PUBLIC_HEADER_HEIGHT = '3.5rem';

export function LandingHero() {
  return (
    <>
      <div
        className="flex w-full flex-col"
        style={{ minHeight: `calc(100dvh - ${PUBLIC_HEADER_HEIGHT})` }}
      >
        <HeroSection />
      </div>
      <section className="border-border border-y py-8">
        <div className="container">
          <MarketIndicesStrip />
        </div>
      </section>
      <DirectionsSection />
      <FeaturesSection />
      <DiarySection />
      <HowSection />
      <CtaSection />
    </>
  );
}
