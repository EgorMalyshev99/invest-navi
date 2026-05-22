import { registerEnumType } from '@nestjs/graphql';

export enum KnowledgeLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

registerEnumType(KnowledgeLevel, {
  name: 'KnowledgeLevel',
});
