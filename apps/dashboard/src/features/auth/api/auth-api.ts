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
import { clearTokens, setTokens } from '@/shared/auth/token-store';

export type { KnowledgeLevel, PreferredLocale };

export async function login(input: LoginInput) {
  const data = await graphqlRequest(LoginDocument, { input });
  setTokens(data.login);
  return data.login;
}

export async function register(input: RegisterInput) {
  const data = await graphqlRequest(RegisterDocument, { input });
  setTokens(data.register);
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
  clearTokens();
}
