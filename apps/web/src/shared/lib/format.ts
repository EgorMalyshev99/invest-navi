const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('ru-RU', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatPrice(value: number, currency = 'RUB'): string {
  if (currency === 'RUB') {
    return rubFormatter.format(value);
  }
  return `${value.toLocaleString('ru-RU')} ${currency}`;
}

export function formatPercent(value: number, options?: { signed?: boolean }): string {
  const signed = options?.signed ?? true;
  const prefix = signed && value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}
