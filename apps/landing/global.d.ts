import type messages from '@repo/i18n-messages/ru.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages;
  }
}
