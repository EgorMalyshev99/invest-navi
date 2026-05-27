import { setRequestLocale } from 'next-intl/server';

import { LearnHubView } from '@/widgets/learn-hub';

interface LearnPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LearnHubView />;
}
