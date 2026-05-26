import type {
  CreateDiaryEntryInput,
  DiaryHypothesisFeedbackInput,
  DiaryStatus,
  UpdateDiaryEntryInput,
} from '@/shared/api/graphql/generated/graphql';

import { graphqlRequest } from '@/shared/api/graphql';
import {
  CreateDiaryEntryDocument,
  DiaryEntriesDocument,
  DiaryEntryDocument,
  DiaryHypothesisFeedbackDocument,
  DiaryRetrospectiveDocument,
  UpdateDiaryEntryDocument,
} from '@/shared/api/graphql/generated/graphql';

export async function fetchDiaryEntries(status?: DiaryStatus) {
  const data = await graphqlRequest(DiaryEntriesDocument, { status });
  return data.diaryEntries;
}

export async function fetchDiaryEntry(id: string) {
  const data = await graphqlRequest(DiaryEntryDocument, { id });
  return data.diaryEntry;
}

export async function createDiaryEntry(input: CreateDiaryEntryInput) {
  const data = await graphqlRequest(CreateDiaryEntryDocument, { input });
  return data.createDiaryEntry;
}

export async function updateDiaryEntry(id: string, input: UpdateDiaryEntryInput) {
  const data = await graphqlRequest(UpdateDiaryEntryDocument, { id, input });
  return data.updateDiaryEntry;
}

export async function fetchDiaryHypothesisFeedback(input: DiaryHypothesisFeedbackInput) {
  const data = await graphqlRequest(DiaryHypothesisFeedbackDocument, { input });
  return data.diaryHypothesisFeedback;
}

export async function fetchDiaryRetrospective(entryId: string, locale: string) {
  const data = await graphqlRequest(DiaryRetrospectiveDocument, { entryId, locale });
  return data.diaryRetrospective;
}
