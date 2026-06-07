'use client';

import {
  BankIcon,
  BinocularsIcon,
  BookOpenIcon,
  BriefcaseIcon,
  ChartLineIcon,
  NotebookIcon,
} from '@phosphor-icons/react';


import { LandingTopicCard } from '../landing-topic-card';
import { SectionHeading } from '../section-heading';

import { useTranslations } from '@/i18n/react-i18n';

const DIRECTION_KEYS = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6'] as const;

const DIRECTION_ICONS = {
  d1: BookOpenIcon,
  d2: ChartLineIcon,
  d3: BinocularsIcon,
  d4: NotebookIcon,
  d5: BriefcaseIcon,
  d6: BankIcon,
} as const;

export function DirectionsSection() {
  const t = useTranslations('landing');

  return (
    <section id="directions" className="bg-secondary/30 py-14 md:py-20">
      <div className="container">
        <SectionHeading title={t('directionsTitle')} subtitle={t('directionsSubtitle')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIRECTION_KEYS.map((key) => (
            <LandingTopicCard
              key={key}
              className="bg-card/90 border-border/80"
              icon={DIRECTION_ICONS[key]}
              iconClassName="bg-primary/10 text-primary"
              title={t(`directions.${key}.title`)}
              body={t(`directions.${key}.body`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
