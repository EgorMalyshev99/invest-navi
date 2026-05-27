import type { EducationalAnswerInput } from '@/shared/api/graphql/generated/graphql';

import { graphqlRequest } from '@/shared/api/graphql';
import { EducationalAnswerDocument } from '@/shared/api/graphql/generated/graphql';

export async function requestEducationalAnswer(input: EducationalAnswerInput) {
  const data = await graphqlRequest(EducationalAnswerDocument, { input });
  return data.educationalAnswer;
}
