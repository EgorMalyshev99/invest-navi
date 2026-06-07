import { createFileRoute } from '@tanstack/react-router';

import { LearnHubView } from '@/widgets/learn-hub';

export const Route = createFileRoute('/_authenticated/learn')({
  component: LearnHubView,
});
