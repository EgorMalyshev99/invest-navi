import { CtaSection } from './sections/cta-section';
import { DiarySection } from './sections/diary-section';
import { DirectionsSection } from './sections/directions-section';
import { FeaturesSection } from './sections/features-section';
import { HeroSection } from './sections/hero-section';
import { HowSection } from './sections/how-section';

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
      <DirectionsSection />
      <FeaturesSection />
      <DiarySection />
      <HowSection />
      <CtaSection />
    </>
  );
}
