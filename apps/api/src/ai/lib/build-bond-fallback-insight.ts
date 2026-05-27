import type { BondInsightContent } from './bond-insight.types';
import type { BondSnapshot } from '@repo/api';

function isGovernmentBond(name: string): boolean {
  const upper = name.toUpperCase();
  return upper.includes('ОФЗ') || upper.includes('OFZ');
}

function formatMaturity(maturityDate: string | undefined, locale: string): string {
  if (!maturityDate) {
    return locale === 'en' ? 'maturity date not specified' : 'срок погашения не указан';
  }
  return maturityDate;
}

export function buildBondFallbackInsight(bond: BondSnapshot, locale: string): BondInsightContent {
  const isEn = locale === 'en';
  const gov = isGovernmentBond(bond.name);
  const maturity = formatMaturity(bond.maturityDate, locale);
  const coupon =
    bond.couponPercent !== undefined
      ? `${bond.couponPercent.toFixed(2)}%`
      : isEn
        ? 'not specified'
        : 'не указан';
  const yieldText =
    bond.yieldAtPrice !== undefined
      ? `${bond.yieldAtPrice.toFixed(2)}%`
      : isEn
        ? 'not available'
        : 'нет данных';

  return {
    overview: isEn
      ? `${bond.name} (${bond.symbol}) is a bond traded on MOEX.${gov ? ' It appears to be a government (OFZ) issue — generally associated with sovereign credit risk, not corporate default risk alone.' : ' Corporate or other issuer bonds may carry issuer-specific credit risk.'} Bond prices can move; coupon income is not guaranteed if the issuer defaults.`
      : `${bond.name} (${bond.symbol}) — облигация на Московской бирже.${gov ? ' Похоже на выпуск ОФЗ (государственный) — обычно связан с суверенным кредитным риском, а не только с риском отдельной компании.' : ' Корпоративные и иные выпуски несут риск конкретного эмитента.'} Цена облигации может меняться; купон не гарантирован при дефолте эмитента.`,
    couponAndMaturity: isEn
      ? `Indicative coupon: ${coupon} per year. Maturity: ${maturity}. Clean price about ${bond.lastPrice.toLocaleString(isEn ? 'en-US' : 'ru-RU')} ${bond.currency ?? 'RUB'} (percent of face value is common for OFZ).`
      : `Ориентировочный купон: ${coupon} годовых. Погашение: ${maturity}. Цена около ${bond.lastPrice.toLocaleString('ru-RU')} ${bond.currency ?? 'RUB'} (для ОФЗ часто в % от номинала).`,
    yieldContext: isEn
      ? `Yield at current price is about ${yieldText}. Higher yield than comparable government bonds may reflect longer maturity, liquidity, or market pricing in more risk — not a guaranteed extra return. Do not compare to bank deposits without noting default and price risk.`
      : `Доходность к погашению/текущей цене около ${yieldText}. Доходность выше сопоставимых ОФЗ может отражать срок, ликвидность или оценку риска рынком — это не гарантия «лишней» прибыли. Не сравнивайте с вкладом без учёта риска дефолта и изменения цены.`,
    rateSensitivity: isEn
      ? 'When market interest rates rise, existing bonds with lower coupons often become less attractive, so their price may fall (and vice versa). Duration and maturity matter: longer issues are usually more sensitive.'
      : 'При росте рыночных ставок облигации с меньшим купоном часто дешевеют, потому что новые выпуски могут предлагать больший доход. Чувствительность выше у длинных бумаг.',
    risks: isEn
      ? [
          'Issuer risk — the company or state must service debt; ratings and news matter.',
          'Rate risk — central bank policy and inflation expectations move bond prices.',
          'Liquidity risk — some issues trade thinly; spreads can widen.',
          gov
            ? 'Sovereign risk still exists (sanctions, fiscal policy) despite OFZ status.'
            : 'Credit spread risk — yield may rise if investors doubt repayment.',
        ]
      : [
          'Риск эмитента — нужна способность платить купоны и номинал.',
          'Процентный риск — ожидания по ключевой ставке и инфляции влияют на цену.',
          'Риск ликвидности — по тонким бумагам сложнее выйти без сдвига цены.',
          gov
            ? 'Суверенный риск сохраняется даже у ОФЗ (макро, бюджет, санкции).'
            : 'Кредитный спред — доходность может расти, если рынок сомневается в эмитенте.',
        ],
    questionsBeforeBuy: isEn
      ? [
          'Who is the issuer and what is their financial health?',
          'When is maturity and are there offers or amortization?',
          'What is the coupon schedule and is it fixed or floating?',
          'How does yield compare to OFZ and why might it differ?',
          'Can you hold until maturity or might you need to sell earlier?',
        ]
      : [
          'Кто эмитент и каково его финансовое положение?',
          'Когда погашение и есть ли оферта или амортизация?',
          'Каков график купонов, фиксированный или плавающий купон?',
          'Почему доходность отличается от сопоставимых ОФЗ?',
          'Готовы ли держать до погашения или может понадобиться продажа раньше?',
        ],
    liquidityNote:
      bond.valueToday > 0
        ? isEn
          ? `Session turnover about ${bond.valueToday.toLocaleString(isEn ? 'en-US' : 'ru-RU')} — a liquidity hint, not a quality score.`
          : `Оборот за сессию около ${bond.valueToday.toLocaleString('ru-RU')} — ориентир по ликвидности, не оценка качества.`
        : isEn
          ? 'Low or missing turnover — exiting at a fair price may be harder.'
          : 'Низкий или нулевой оборот — выйти по желаемой цене может быть сложнее.',
  };
}
