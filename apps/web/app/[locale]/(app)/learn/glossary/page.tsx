import { setRequestLocale } from 'next-intl/server';

import { GlossaryView } from '@/widgets/learn-hub';

interface GlossaryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GlossaryView />;
}
