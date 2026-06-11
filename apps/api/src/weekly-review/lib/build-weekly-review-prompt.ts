import type { AssetSnapshot, IndexSnapshot, SectorSnapshot } from '@repo/api';

import type { WeeklyReviewContent } from './weekly-review.types';

interface WeeklyReviewPromptInput {
  indices: IndexSnapshot[];
  sectors: SectorSnapshot[];
  topMovers: AssetSnapshot[];
  locale: string;
}

export function buildWeeklyReviewPrompt(input: WeeklyReviewPromptInput): {
  system: string;
  user: string;
} {
  const isEn = input.locale === 'en';
  const system = isEn
    ? 'You are an educational market analyst for Russian MOEX investors. Respond ONLY with valid JSON. No buy/sell/hold recommendations. No guaranteed returns. Use cautious language ("may", "likely").'
    : 'Ты образовательный аналитик российского рынка (Мосбиржа). Отвечай ТОЛЬКО валидным JSON. Без рекомендаций покупать/продавать/держать. Без гарантий доходности. Используй осторожные формулировки («вероятно», «может»).';

  const indicesBlock = input.indices
    .map(
      (index) =>
        `${index.code}: ${index.currentValue.toFixed(2)} (${index.changePercent.toFixed(2)}%)`,
    )
    .join('\n');

  const sectorsBlock = input.sectors
    .slice(0, 8)
    .map((sector) => `${sector.name}: ${sector.changePercent.toFixed(2)}%`)
    .join('\n');

  const moversBlock = input.topMovers
    .slice(0, 8)
    .map((asset) => `${asset.symbol} ${asset.changePercent.toFixed(2)}%`)
    .join('\n');

  const schema = `{
  "summary": "string",
  "sectors": ["string"],
  "bondsAndRub": "string",
  "events": ["string"],
  "risksForNextWeek": ["string"]
}`;

  const user = isEn
    ? `Write a weekly educational market review based on data below. JSON schema:\n${schema}\n\nIndices:\n${indicesBlock}\n\nSectors:\n${sectorsBlock}\n\nNotable movers:\n${moversBlock}`
    : `Составь еженедельный образовательный обзор рынка по данным ниже. JSON-схема:\n${schema}\n\nИндексы:\n${indicesBlock}\n\nСектора:\n${sectorsBlock}\n\nЗаметные бумаги:\n${moversBlock}`;

  return { system, user };
}

export function buildFallbackWeeklyReview(locale: string): WeeklyReviewContent {
  if (locale === 'en') {
    return {
      summary:
        'The market may have looked cautious this week. Investors likely watched rates, the ruble, and corporate news.',
      sectors: [
        'Sector moves varied; some areas may have looked stronger than the broad index.',
        'Defensive sectors may have been relatively stable amid uncertainty.',
      ],
      bondsAndRub:
        'Bonds may remain sensitive to rate expectations. The ruble could add volatility to importers and exporters.',
      events: ['Macro data and central-bank rhetoric may have influenced sentiment.'],
      risksForNextWeek: [
        'Rate and currency surprises',
        'Concentration in a few liquid names',
        'Gap between expectations and company updates',
      ],
    };
  }

  return {
    summary:
      'На этой неделе рынок мог выглядеть осторожно. Инвесторы, вероятно, следили за ставкой, валютой и корпоративными новостями.',
    sectors: [
      'Сектора двигались по-разному; отдельные отрасли могли выглядеть сильнее широкого индекса.',
      'Защитные сектора могли быть относительно устойчивее на фоне неопределённости.',
    ],
    bondsAndRub:
      'Облигации могут оставаться чувствительными к ожиданиям по ставке. Рубль способен добавлять волатильность импортёрам и экспортёрам.',
    events: ['Макроданные и риторика регулятора могли влиять на настроения.'],
    risksForNextWeek: [
      'Сюрпризы по ставке и валюте',
      'Концентрация в нескольких ликвидных бумагах',
      'Разрыв между ожиданиями и отчётностью компаний',
    ],
  };
}
