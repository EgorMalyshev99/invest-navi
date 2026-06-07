'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import { ChangeBadge } from './change-badge';


interface MarketQuoteCardProps {
  title: string;
  value: string;
  changePercent: number;
}

export function MarketQuoteCard({ title, value, changePercent }: MarketQuoteCardProps) {
  return (
    <Card className="bg-card/60">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="font-mono text-xl font-semibold tabular-nums">{value}</p>
        <ChangeBadge value={changePercent} />
      </CardContent>
    </Card>
  );
}
