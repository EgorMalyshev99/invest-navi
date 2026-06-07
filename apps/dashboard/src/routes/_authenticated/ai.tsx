import { createFileRoute } from '@tanstack/react-router';

import { AiAssistantView } from '@/widgets/ai-assistant-view';

export const Route = createFileRoute('/_authenticated/ai')({
  component: AiAssistantView,
});
