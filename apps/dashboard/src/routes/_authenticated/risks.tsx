import { createFileRoute } from '@tanstack/react-router';

import { RisksView } from '@/widgets/risks-view';

export const Route = createFileRoute('/_authenticated/risks')({
  component: RisksView,
});
