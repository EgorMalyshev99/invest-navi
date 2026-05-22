import { registerEnumType } from '@nestjs/graphql';

export enum PreferredLocale {
  RU = 'ru',
  EN = 'en',
}

registerEnumType(PreferredLocale, {
  name: 'PreferredLocale',
});
