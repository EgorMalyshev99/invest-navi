import { createFileRoute } from '@tanstack/react-router';

import { AssetDetail } from '@/widgets/asset-detail';

export const Route = createFileRoute('/_authenticated/market/$symbol')({
  component: AssetPage,
});

function AssetPage() {
  const { symbol } = Route.useParams();
  return <AssetDetail symbol={symbol.toUpperCase()} />;
}
