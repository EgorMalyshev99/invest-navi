import type {
  KnowledgeLevel,
  LoginInput,
  PreferredLocale,
  RegisterInput,
  UpdateProfileInput,
} from '@/shared/api/graphql/generated/graphql';

import { graphqlRequest } from '@/shared/api/graphql';
import {
  LoginDocument,
  MeDocument,
  RegisterDocument,
  UpdateProfileDocument,
} from '@/shared/api/graphql/generated/graphql';
import { clearAuthTokens, setAuthTokens } from '@/shared/lib/auth-cookies';

export type { KnowledgeLevel, PreferredLocale };

export async function login(input: LoginInput) {
  const data = await graphqlRequest(LoginDocument, { input });
  setAuthTokens(data.login.accessToken, data.login.refreshToken);
  return data.login;
}

export async function register(input: RegisterInput) {
  const data = await graphqlRequest(RegisterDocument, { input });
  setAuthTokens(data.register.accessToken, data.register.refreshToken);
  return data.register;
}

export async function fetchMe() {
  return graphqlRequest(MeDocument);
}

export async function updateProfile(input: UpdateProfileInput) {
  const data = await graphqlRequest(UpdateProfileDocument, { input });
  return data.updateProfile;
}

export function logout() {
  clearAuthTokens();
}
