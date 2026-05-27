import { print } from 'graphql';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { getGraphqlUrl } from '@/shared/config/env';
import { getAccessToken } from '@/shared/lib/auth-cookies';

export class GraphqlRequestError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'GraphqlRequestError';
  }
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<TResult, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  const accessToken = getAccessToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new GraphqlRequestError(`GraphQL HTTP ${response.status}`);
  }

  const payload = (await response.json()) as GraphqlResponse<TResult>;

  if (payload.errors?.length) {
    throw new GraphqlRequestError(payload.errors.map((e) => e.message).join('; '), payload.errors);
  }

  if (!payload.data) {
    throw new GraphqlRequestError('GraphQL response has no data');
  }

  return payload.data;
}
