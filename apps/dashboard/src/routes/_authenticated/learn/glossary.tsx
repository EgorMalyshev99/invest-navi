import { createFileRoute } from '@tanstack/react-router';

import { GlossaryView } from '@/widgets/learn-hub';

export const Route = createFileRoute('/_authenticated/learn/glossary')({
  component: GlossaryView,
});
