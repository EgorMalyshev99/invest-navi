import { setRequestLocale } from 'next-intl/server';

import { AiAssistantView } from '@/widgets/ai-assistant-view';

interface AiPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AiPage({ params }: AiPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AiAssistantView />;
}
