import { print } from 'graphql';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { graphqlUrl } from '@/shared/config/env';

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
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
    next: { revalidate: 60 },
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
