import type { AssetInsightContent } from './insight.types';
import type { AssetSnapshot, IndexSnapshot } from '@repo/api';

const SECTOR_LABELS: Record<string, { ru: string; en: string }> = {
  MOEXFN: { ru: 'Финансы', en: 'Financials' },
  MOEXOG: { ru: 'Нефть и газ', en: 'Oil & gas' },
  financial: { ru: 'Финансы', en: 'Financials' },
  energy: { ru: 'Энергетика', en: 'Energy' },
};

function sectorLabel(sector: string | undefined, locale: string): string | undefined {
  if (!sector) {
    return undefined;
  }
  const entry = SECTOR_LABELS[sector];
  if (entry) {
    return locale === 'en' ? entry.en : entry.ru;
  }
  return sector;
}

export function buildFallbackInsight(
  asset: AssetSnapshot,
  indices: IndexSnapshot[],
  locale: string,
): AssetInsightContent {
  const isEn = locale === 'en';
  const sector = sectorLabel(asset.sector, locale);
  const imoex = indices.find((index) => index.code === 'IMOEX');

  const vsIndex =
    imoex && imoex.changePercent !== 0
      ? isEn
        ? `The asset moved ${asset.changePercent >= 0 ? 'above' : 'below'} IMOEX (${imoex.changePercent.toFixed(2)}%) this session — context only, not a trading signal.`
        : `Изменение актива ${asset.changePercent >= 0 ? 'выше' : 'ниже'} динамики IMOEX (${imoex.changePercent.toFixed(2)}%) за сессию — контекст, а не сигнал к действию.`
      : undefined;

  return {
    whatIs: isEn
      ? `${asset.name} (${asset.symbol}) is a MOEX-listed share.${sector ? ` Sector: ${sector}.` : ''} Price reflects market expectations and can diverge from any "fair" value.`
      : `${asset.name} (${asset.symbol}) — акция на Московской бирже.${sector ? ` Сектор: ${sector}.` : ''} Цена отражает ожидания рынка.`,
    whatChanged: isEn
      ? `Last price ${asset.lastPrice.toLocaleString(isEn ? 'en-US' : 'ru-RU')} ${asset.currency ?? 'RUB'}, session change ${asset.changePercent >= 0 ? '+' : ''}${asset.changePercent.toFixed(2)}%.`
      : `Цена ${asset.lastPrice.toLocaleString('ru-RU')} ${asset.currency ?? 'RUB'}, изменение ${asset.changePercent >= 0 ? '+' : ''}${asset.changePercent.toFixed(2)}% за сессию.`,
    whyMatters: isEn
      ? 'Short-term moves often reflect sector news, rates, FX, or sentiment. Check whether the move fits your hypothesis — not a forecast of returns.'
      : 'Краткие движения часто связаны с сектором, ставкой, валютой или настроением рынка. Сверьте движение с гипотезой — это не прогноз доходности.',
    risks: isEn
      ? [
          'Market risk — broad sell-offs can drag the stock down.',
          sector
            ? `Sector risk (${sector}) — industry factors affect many names.`
            : 'Sector risk — industry factors affect a group of issuers.',
          'Liquidity risk — low turnover can make entries/exits harder.',
          asset.dividendYieldPercent
            ? `Dividend yield (~${asset.dividendYieldPercent.toFixed(1)}%) is not guaranteed.`
            : 'Dividends are not guaranteed.',
        ]
      : [
          'Рыночный риск — общее падение рынка может потянуть бумагу вниз.',
          sector ? `Секторный риск (${sector}).` : 'Секторный риск — отраслевые факторы.',
          'Риск ликвидности — при низком обороте сложнее выйти по желаемой цене.',
          asset.dividendYieldPercent
            ? `Дивидендная доходность (~${asset.dividendYieldPercent.toFixed(1)}%) не гарантирована.`
            : 'Дивиденды не гарантированы.',
        ],
    forInvestor: isEn
      ? 'Educational profile only: may suit investors who accept equity volatility; not a substitute for deposits or personal advice.'
      : 'Только для образования: может быть интересен тем, кто принимает волатильность акций; не замена вкладу и не персональная рекомендация.',
    vsIndex,
  };
}
