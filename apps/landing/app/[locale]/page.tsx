import { CtaSection } from '@/components/landing/sections/cta-section';
import { DiarySection } from '@/components/landing/sections/diary-section';
import { DirectionsSection } from '@/components/landing/sections/directions-section';
import { FeaturesSection } from '@/components/landing/sections/features-section';
import { HeroSection } from '@/components/landing/sections/hero-section';
import { HowSection } from '@/components/landing/sections/how-section';
import { ProductSection } from '@/components/landing/sections/product-section';
import { PublicShell } from '@/components/layout/default';

const PUBLIC_HEADER_HEIGHT = '3.5rem';

export default function LandingPage() {
  return (
    <PublicShell>
      <div
        className="flex w-full flex-col"
        style={{ minHeight: `calc(100dvh - ${PUBLIC_HEADER_HEIGHT})` }}
      >
        <HeroSection />
      </div>
      <DirectionsSection />
      <ProductSection />
      <FeaturesSection />
      <DiarySection />
      <HowSection />
      <CtaSection />
    </PublicShell>
  );
}
