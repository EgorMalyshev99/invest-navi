import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

const messages = {
  en: () => import('@repo/i18n-messages/en.json').then((module) => module.default),
  ru: () => import('@repo/i18n-messages/ru.json').then((module) => module.default),
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: await messages[locale as keyof typeof messages](),
  };
});
