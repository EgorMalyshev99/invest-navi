'use client';

import { useTranslations } from 'next-intl';

import { GlossaryTerm } from '@/features/glossary-tip';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function BondsIntroPanel() {
  const t = useTranslations('bonds');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('introTitle')}</CardTitle>
        <p className="text-muted-foreground text-sm">{t('introSubtitle')}</p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="what-is-bond">
            <AccordionTrigger>{t('introWhatIsBond')}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {t.rich('introWhatIsBondBody', {
                coupon: () => <GlossaryTerm termId="coupon">{t('introCouponLabel')}</GlossaryTerm>,
              })}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="high-yield">
            <AccordionTrigger>{t('introHighYield')}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {t('introHighYieldBody')}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="rate-risk">
            <AccordionTrigger>{t('introRateRisk')}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
              {t('introRateRiskBody')}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
