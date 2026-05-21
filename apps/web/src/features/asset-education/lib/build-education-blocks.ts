import { estimateRiskLevel } from './estimate-risk';

import type { Asset, MarketIndex } from '@/entities/asset';

import { getSectorLabel } from '@/entities/asset';

export interface EducationBlock {
  id: string;
  title: string;
  body: string;
}

export interface AssetEducation {
  whatIs: string;
  whatChanged: string;
  whyMatters: string;
  risks: string[];
  forInvestor: string;
  riskLevel: ReturnType<typeof estimateRiskLevel>;
  sectorLabel?: string;
  vsIndexText?: string;
}

export function buildAssetEducation(asset: Asset, indices: MarketIndex[]): AssetEducation {
  const sectorLabel = getSectorLabel(asset.sector);
  const riskLevel = estimateRiskLevel(asset);
  const imoex = indices.find((index) => index.code === 'IMOEX');
  const vsIndexText =
    imoex && imoex.changePercent !== 0
      ? `Изменение актива ${asset.changePercent >= 0 ? 'выше' : 'ниже'} динамики индекса IMOEX (${imoex.changePercent.toFixed(2)}%) за сессию — это контекст, а не сигнал к действию.`
      : undefined;

  const typeLabel = asset.instrumentType === 'Share' ? 'акция' : asset.instrumentType.toLowerCase();

  return {
    riskLevel,
    sectorLabel,
    vsIndexText,
    whatIs: `${asset.name} (${asset.symbol}) — ${typeLabel} на Московской бирже.${sectorLabel ? ` Сектор: ${sectorLabel}.` : ''} Цена отражает ожидания участников рынка и может меняться без связи с «справедливой» стоимостью.`,
    whatChanged: `Текущая цена ${asset.lastPrice.toLocaleString('ru-RU')} ${asset.currency ?? 'RUB'}, изменение за сессию ${asset.changePercent >= 0 ? '+' : ''}${asset.changePercent.toFixed(2)}%.${asset.valueToday > 0 ? ` Оборот ${asset.valueToday.toLocaleString('ru-RU')} — показатель интереса, не качества эмитента.` : ''}`,
    whyMatters:
      'Краткие движения цены часто связаны с новостями сектора, макроэкономикой (ставка, валюта) или настроением рынка. Имеет смысл проверить, совпадает ли изменение с вашей гипотезой, а не воспринимать его как факт будущей доходности.',
    risks: [
      'Рыночный риск — общее движение рынка может затянуть актив вниз даже при хороших новостях по компании.',
      sectorLabel
        ? `Секторный риск (${sectorLabel}) — отраслевые факторы влияют на группу эмитентов.`
        : 'Секторный риск — отраслевые факторы влияют на группу эмитентов.',
      'Риск ликвидности — при низком обороте сложнее войти/выйти по желаемой цене.',
      asset.dividendYieldPercent
        ? `Доходность по дивидендам (~${asset.dividendYieldPercent.toFixed(1)}%) не гарантирована и может измениться.`
        : 'Дивиденды и buyback не гарантированы — зависят от решений компании и регуляторики.',
    ],
    forInvestor:
      riskLevel === 'high'
        ? 'Может быть интересен тем, кто понимает волатильность и готов к просадкам. Не подходит тем, кто ищет стабильность, сопоставимую с банковским вкладом.'
        : riskLevel === 'medium'
          ? 'Подходит для изучения в рамках диверсифицированного наблюдения. Важно сравнить с облигациями/фондами, если цель — снизить колебания портфеля.'
          : 'Относительно спокойная динамика за сессию, но долгосрочные риски акций сохраняются. Полезно зафиксировать критерии, при которых идея перестаёт быть актуальной.',
  };
}

export function toEducationBlocks(
  education: AssetEducation,
  titles: {
    whatIs: string;
    whatChanged: string;
    whyMatters: string;
    risks: string;
    forInvestor: string;
  },
): EducationBlock[] {
  return [
    { id: 'what-is', title: titles.whatIs, body: education.whatIs },
    { id: 'what-changed', title: titles.whatChanged, body: education.whatChanged },
    { id: 'why-matters', title: titles.whyMatters, body: education.whyMatters },
    {
      id: 'risks',
      title: titles.risks,
      body: education.risks.map((item) => `• ${item}`).join('\n'),
    },
    { id: 'for-investor', title: titles.forInvestor, body: education.forInvestor },
  ];
}
