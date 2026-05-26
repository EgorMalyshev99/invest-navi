import type { DiaryHypothesisFeedbackContent } from './diary-feedback.types';

export interface DiaryDraftPayload {
  assetSymbol: string;
  action: string;
  horizon: string;
  rationale?: string | null;
  risks?: string | null;
  successCriteria?: string | null;
  failureCriteria?: string | null;
  confidence?: number | null;
}

export function buildDiaryHypothesisPrompt(
  draft: DiaryDraftPayload,
  locale: string,
): { system: string; user: string } {
  const language = locale === 'en' ? 'English' : 'Russian';

  const system = `You are an educational coach for Russian market investors reviewing a personal investment journal draft.
Write in ${language}.
NEVER recommend buy, sell, or hold.
NEVER promise returns.
Help the user think deeper: highlight strengths, gaps, and self-check questions.
Use cautious wording.
Respond with JSON only:
{
  "summary": "string",
  "strengths": ["string"],
  "gaps": ["string"],
  "questions": ["string", "string", "string"]
}`;

  const user = `Review this hypothesis draft:
Symbol: ${draft.assetSymbol}
Action intent: ${draft.action}
Horizon: ${draft.horizon}
Why interested: ${draft.rationale?.trim() || '(empty)'}
Risks noted: ${draft.risks?.trim() || '(empty)'}
Success criteria: ${draft.successCriteria?.trim() || '(empty)'}
Failure criteria: ${draft.failureCriteria?.trim() || '(empty)'}
Confidence 1-10: ${draft.confidence ?? 'not set'}`;

  return { system, user };
}

export function buildFallbackDiaryFeedback(
  draft: DiaryDraftPayload,
  locale: string,
): DiaryHypothesisFeedbackContent {
  const isEn = locale === 'en';
  const gaps: string[] = [];

  if (!draft.risks?.trim()) {
    gaps.push(
      isEn
        ? 'Risks are empty — consider sector, rates, FX, and liquidity.'
        : 'Риски не указаны — подумайте о секторе, ставке, валюте и ликвидности.',
    );
  }
  if (!draft.successCriteria?.trim()) {
    gaps.push(
      isEn
        ? 'Success criteria are missing — what would confirm your idea?'
        : 'Нет критериев успеха — что подтвердит, что идея сработала?',
    );
  }
  if (!draft.failureCriteria?.trim()) {
    gaps.push(
      isEn
        ? 'Failure criteria are missing — when would you admit the idea was wrong?'
        : 'Нет критериев ошибки — при каких условиях вы признаете идею неверной?',
    );
  }
  if (!draft.rationale?.trim()) {
    gaps.push(
      isEn
        ? 'Rationale is empty — why is this asset interesting to you now?'
        : 'Нет обоснования — почему актив интересен именно сейчас?',
    );
  }

  return {
    summary: isEn
      ? 'This is a draft for your journal, not advice. Fill gaps below before committing to a decision.'
      : 'Это черновик для дневника, не рекомендация. Заполните пробелы ниже, прежде чем принимать решение.',
    strengths: draft.rationale?.trim()
      ? [
          isEn
            ? 'You stated why the asset interests you — good starting point.'
            : 'Вы описали, почему актив интересен — хорошая отправная точка.',
        ]
      : [],
    gaps,
    questions: isEn
      ? [
          'What could invalidate this idea in the next quarter?',
          'How does this fit your overall portfolio risk?',
          'What data would you check before acting?',
        ]
      : [
          'Что может опровергнуть идею в ближайшем квартале?',
          'Как это вписывается в общий риск-профиль?',
          'Какие данные вы проверите перед действием?',
        ],
  };
}
