export interface QuotationLike {
  units?: string | number;
  nano?: number;
}

export function quotationToNumber(value?: QuotationLike | null): number {
  if (!value) {
    return 0;
  }
  const units = Number(value.units ?? 0);
  const nano = Number(value.nano ?? 0);
  const total = units + nano / 1e9;
  return Number.isFinite(total) ? total : 0;
}
