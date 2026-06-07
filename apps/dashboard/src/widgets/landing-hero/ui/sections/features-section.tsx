'use client';

import {
  ChartLineUpIcon,
  InfoIcon,
  LightbulbIcon,
  ListChecksIcon,
  ScalesIcon,
  WarningIcon,
} from '@phosphor-icons/react';


import { LandingTopicCard } from '../landing-topic-card';
import { SectionHeading } from '../section-heading';

import { useTranslations } from '@/i18n/react-i18n';

const FEATURE_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

const FEATURE_ICONS = {
  q1: InfoIcon,
  q2: ChartLineUpIcon,
  q3: LightbulbIcon,
  q4: WarningIcon,
  q5: ScalesIcon,
  q6: ListChecksIcon,
} as const;

export function FeaturesSection() {
  const t = useTranslations('landing');

  return (
    <section id="features" className="py-14 md:py-20">
      <div className="container">
        <SectionHeading title={t('featuresTitle')} subtitle={t('featuresSubtitle')} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_KEYS.map((key) => (
            <LandingTopicCard
              key={key}
              icon={FEATURE_ICONS[key]}
              iconClassName="bg-accent/10 text-accent"
              title={t(`features.${key}.title`)}
              body={t(`features.${key}.body`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
