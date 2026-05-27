export type EducationalKnowledgeLevel = 'beginner' | 'intermediate' | 'advanced';

export interface EducationalAnswerPromptContext {
  question: string;
  locale: string;
  knowledgeLevel: EducationalKnowledgeLevel;
}

function knowledgeTone(level: EducationalKnowledgeLevel, isEn: boolean): string {
  if (level === 'beginner') {
    return isEn
      ? 'The user is a beginner. Use simple words, short sentences, one or two analogies max.'
      : 'Пользователь — новичок. Простые слова, короткие предложения, максимум одна-две аналогии.';
  }
  if (level === 'advanced') {
    return isEn
      ? 'The user is experienced. You may use standard market terms but still explain assumptions.'
      : 'Пользователь опытный. Можно использовать термины рынка, но поясняй допущения.';
  }
  return isEn
    ? 'The user has basic experience. Balance clarity with light terminology.'
    : 'Пользователь с базовым опытом. Баланс ясности и лёгкой терминологии.';
}

export function buildEducationalAnswerPrompt(context: EducationalAnswerPromptContext): {
  system: string;
  user: string;
} {
  const isEn = context.locale === 'en';
  const tone = knowledgeTone(context.knowledgeLevel, isEn);

  const system = isEn
    ? `You are an educational assistant for Russian retail investors (MOEX context).
${tone}
NEVER recommend buy, sell, or hold.
NEVER promise returns or say risk-free.
NEVER compare bonds or stocks to bank deposits without default and price risk caveats.
Do not claim you know why prices moved as fact — use "may", "possibly".
Answer in plain text only (no JSON, no markdown headings).
End with a brief reminder that this is not investment advice.`
    : `Ты образовательный помощник для частных инвесторов на российском рынке (контекст MOEX).
${tone}
НИКОГДА не пиши «покупай», «продавай», «держи».
Не обещай доходность и не пиши «без риска».
Не сравнивай облигации или акции с вкладом без оговорок о дефолте и изменении цены.
Не утверждай причины движения цены как факт — используй «может», «вероятно».
Ответ только простым текстом (без JSON, без заголовков markdown).
В конце кратко напомни, что это не инвестиционная рекомендация.`;

  const user = isEn
    ? `User question:\n${context.question}`
    : `Вопрос пользователя:\n${context.question}`;

  return { system, user };
}

export function buildFallbackEducationalAnswer(locale: string): string {
  const isEn = locale === 'en';
  return isEn
    ? 'We could not produce a safe educational answer for this wording. Try rephrasing your question about how markets work, risks, or terms — without asking what to buy or sell. This is not investment advice.'
    : 'Не удалось сформировать безопасный образовательный ответ на такую формулировку. Переформулируйте вопрос о том, как устроен рынок, какие бывают риски или что означает термин — без просьбы «что купить/продать». Это не инвестиционная рекомендация.';
}
