import { createFileRoute } from '@tanstack/react-router';

import { AssetCatalog } from '@/widgets/asset-catalog';

export const Route = createFileRoute('/_authenticated/market')({
  component: AssetCatalog,
});
