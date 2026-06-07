'use client';


import { LandingStepCard } from '../landing-step-card';
import { SectionHeading } from '../section-heading';

import { useTranslations } from '@/i18n/react-i18n';

const STEP_KEYS = ['s1', 's2', 's3'] as const;
const TOTAL_STEPS = STEP_KEYS.length;

export function HowSection() {
  const t = useTranslations('landing');

  return (
    <section id="how" className="bg-secondary/30 py-14 md:py-20">
      <div className="container">
        <SectionHeading title={t('howTitle')} subtitle={t('howSubtitle')} />
        <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
          {STEP_KEYS.map((key, index) => (
            <li key={key} className="min-h-0">
              <LandingStepCard
                step={index + 1}
                stepLabel={t('stepLabel', { step: index + 1 })}
                totalSteps={TOTAL_STEPS}
                title={t(`steps.${key}.title`)}
                body={t(`steps.${key}.body`)}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
