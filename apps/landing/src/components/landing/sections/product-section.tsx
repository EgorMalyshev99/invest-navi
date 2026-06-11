'use client';

import {
  ChartLineIcon,
  GraduationCapIcon,
  RobotIcon,
  ShieldWarningIcon,
  SparkleIcon,
} from '@phosphor-icons/react';
import { Button } from '@repo/ui';
import { useTranslations } from 'next-intl';

import { LandingTopicCard } from '../landing-topic-card';
import { SectionHeading } from '../section-heading';

import { getDashboardUrl } from '@/config/env';

const PRODUCT_KEYS = ['learn', 'overview', 'risks', 'ai'] as const;

const PRODUCT_ICONS = {
  learn: GraduationCapIcon,
  overview: ChartLineIcon,
  risks: ShieldWarningIcon,
  ai: RobotIcon,
} as const;

export function ProductSection() {
  const t = useTranslations('landing.product');

  return (
    <section id="product" className="py-14 md:py-20">
      <div className="container flex flex-col gap-8">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />
        <div className="grid gap-4 sm:grid-cols-2">
          {PRODUCT_KEYS.map((key) => (
            <LandingTopicCard
              key={key}
              className="bg-card border-border/80 h-full"
              icon={PRODUCT_ICONS[key]}
              iconClassName="bg-accent/10 text-accent"
              title={t(`items.${key}.title`)}
              body={t(`items.${key}.body`)}
            />
          ))}
        </div>
        <div className="border-primary/20 from-primary/5 to-accent/5 bg-card rounded-xl border bg-linear-to-br p-6 md:p-8">
          <div className="text-primary mb-3 flex items-center gap-2">
            <span className="inline-flex size-5" aria-hidden>
              <SparkleIcon size={20} />
            </span>
            <h3 className="text-lg font-semibold">{t('weeklyTitle')}</h3>
          </div>
          <p className="text-muted-foreground mb-4 max-w-3xl text-sm leading-relaxed">
            {t('weeklyBody')}
          </p>
          <Button asChild>
            <a href={getDashboardUrl('/overview')}>{t('weeklyCta')}</a>
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-sm">{t('oauthNote')}</p>
      </div>
    </section>
  );
}
