export interface DiaryRetroContext {
  assetSymbol: string;
  action: string;
  horizon: string;
  rationale?: string | null;
  successCriteria?: string | null;
  failureCriteria?: string | null;
  daysElapsed: number;
  priceChangePercent?: number;
  indexChangePercent?: number;
  locale: string;
}

export function buildDiaryRetroPrompt(context: DiaryRetroContext): {
  system: string;
  user: string;
} {
  const language = context.locale === 'en' ? 'English' : 'Russian';

  const system = `You are an educational assistant helping an investor review their past journal hypothesis.
Write in ${language}.
NEVER recommend buy, sell, or hold.
Do not claim you know why price moved — use "may", "possibly".
Compare outcomes cautiously vs index when data is provided.
Respond with JSON only:
{
  "summary": "string",
  "questions": ["string", "string"]
}`;

  const user = `Retrospective review:
Symbol: ${context.assetSymbol}
Original action intent: ${context.action}
Horizon: ${context.horizon}
Days since entry: ${context.daysElapsed}
Original rationale: ${context.rationale?.trim() || '(empty)'}
Success criteria: ${context.successCriteria?.trim() || '(empty)'}
Failure criteria: ${context.failureCriteria?.trim() || '(empty)'}
Price change % since entry: ${context.priceChangePercent ?? 'n/a'}
IMOEX change % since entry: ${context.indexChangePercent ?? 'n/a'}`;

  return { system, user };
}

export function buildFallbackRetro(context: DiaryRetroContext): {
  summary: string;
  questions: string[];
} {
  const isEn = context.locale === 'en';
  const pricePart =
    context.priceChangePercent !== undefined
      ? `${context.priceChangePercent.toFixed(1)}%`
      : isEn
        ? 'unknown'
        : 'нет данных';
  const indexPart =
    context.indexChangePercent !== undefined
      ? `${context.indexChangePercent.toFixed(1)}%`
      : isEn
        ? 'unknown'
        : 'нет данных';

  return {
    summary: isEn
      ? `About ${context.daysElapsed} days ago you logged a hypothesis on ${context.assetSymbol}. Price change since entry: ${pricePart}; IMOEX: ${indexPart}. This is not a verdict — compare with your success/failure criteria and what you learned.`
      : `Около ${context.daysElapsed} дн. назад вы зафиксировали гипотезу по ${context.assetSymbol}. Изменение цены с момента записи: ${pricePart}; IMOEX: ${indexPart}. Это не оценка «удачи» — сверьте с критериями успеха/ошибки и своими выводами.`,
    questions: isEn
      ? [
          'Did price move match what you expected in your success criteria?',
          'Would you change your risk list if entering the idea today?',
          'What would you do differently in the research process?',
        ]
      : [
          'Совпало ли движение цены с тем, что вы описали в критериях успеха?',
          'Изменили бы вы список рисков, если бы формулировали идею сегодня?',
          'Что бы вы сделали иначе в процессе изучения актива?',
        ],
  };
}
