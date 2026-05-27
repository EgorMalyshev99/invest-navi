import { setRequestLocale } from 'next-intl/server';

import { RisksView } from '@/widgets/risks-view';

interface RisksPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RisksPage({ params }: RisksPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RisksView />;
}
