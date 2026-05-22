'use client';

import { useTranslations } from 'next-intl';

import type { WatchlistStatus } from '../model/types';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';


const STATUSES: WatchlistStatus[] = [
  'watching',
  'researching',
  'idea',
  'in_portfolio',
  'too_risky',
];

interface WatchlistStatusSelectProps {
  value: WatchlistStatus;
  onValueChange: (value: WatchlistStatus) => void;
}

export function WatchlistStatusSelect({ value, onValueChange }: WatchlistStatusSelectProps) {
  const t = useTranslations('watchlistStatus');

  return (
    <Select value={value} onValueChange={(next) => onValueChange(next as WatchlistStatus)}>
      <SelectTrigger className="w-full min-w-[10rem]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {t(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
