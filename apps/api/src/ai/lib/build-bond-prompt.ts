import type { BondSnapshot } from '@repo/api';

export function buildBondInsightPrompt(
  bond: BondSnapshot,
  locale: string,
): { system: string; user: string } {
  const isEn = locale === 'en';

  const system = isEn
    ? `You are an educational assistant for Russian retail investors. Explain bonds in plain language.
NEVER say buy, sell, or hold. NEVER predict prices or target yields. NEVER compare bonds to bank deposits without default and price risk disclaimers.
Respond with JSON only:
{
  "overview": string,
  "couponAndMaturity": string,
  "yieldContext": string,
  "rateSensitivity": string,
  "risks": string[],
  "questionsBeforeBuy": string[],
  "liquidityNote": string (optional)
}`
    : `Ты образовательный помощник для частных инвесторов на российском рынке. Объясняй облигации простым языком.
НИКОГДА не пиши «покупай», «продавай», «держи». Не прогнозируй цены. Не сравнивай с вкладом без оговорок о риске дефолта и изменения цены.
Ответ — только JSON:
{
  "overview": string,
  "couponAndMaturity": string,
  "yieldContext": string,
  "rateSensitivity": string,
  "risks": string[],
  "questionsBeforeBuy": string[],
  "liquidityNote": string (опционально)
}`;

  const user = isEn
    ? `Bond data (MOEX):
${JSON.stringify(bond, null, 2)}

Explain: issuer context, coupon and maturity, yield vs risk, rate sensitivity, 5 questions before investing.`
    : `Данные облигации (MOEX):
${JSON.stringify(bond, null, 2)}

Объясни: эмитент, купон и погашение, доходность и риск, чувствительность к ставке, 5 вопросов перед решением.`;

  return { system, user };
}
