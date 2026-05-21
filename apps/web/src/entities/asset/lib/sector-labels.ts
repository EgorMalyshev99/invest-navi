const SECTOR_LABELS: Record<string, string> = {
  MOEXCH: 'Потребительский сектор',
  MOEXCN: 'Потребительский сектор',
  MOEXFN: 'Финансы',
  MOEXMM: 'Металлы и добыча',
  MOEXOG: 'Нефть и газ',
  MOEXTL: 'Телеком и IT',
  financial: 'Финансы',
  energy: 'Энергетика',
  materials: 'Материалы',
  industrials: 'Промышленность',
  consumer: 'Потребительский сектор',
  healthcare: 'Здравоохранение',
  it: 'IT',
  telecommunication: 'Телеком',
  real_estate: 'Недвижимость',
  utilities: 'Коммунальные услуги',
  other: 'Прочее',
};

export function getSectorLabel(sector?: string | null): string | undefined {
  if (!sector) {
    return undefined;
  }
  return SECTOR_LABELS[sector] ?? sector;
}
