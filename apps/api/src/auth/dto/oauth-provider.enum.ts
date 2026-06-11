import { registerEnumType } from '@nestjs/graphql';

export enum OAuthProvider {
  YANDEX = 'yandex',
  GOOGLE = 'google',
}

registerEnumType(OAuthProvider, { name: 'OAuthProvider' });
