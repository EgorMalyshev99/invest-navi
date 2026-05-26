import type {
  DiaryAction,
  DiaryHorizon,
  DiaryStatus,
} from '@/shared/api/graphql/generated/graphql';

export type DiaryActionValue = 'observe' | 'buy' | 'sell' | 'hold';
export type DiaryHorizonValue = '1m' | '3m' | '1y' | 'long';
export type DiaryStatusValue = 'active' | 'completed' | 'cancelled';

const actionToGraphql: Record<DiaryActionValue, DiaryAction> = {
  observe: 'OBSERVE',
  buy: 'BUY',
  sell: 'SELL',
  hold: 'HOLD',
};

const actionFromGraphql: Record<DiaryAction, DiaryActionValue> = {
  OBSERVE: 'observe',
  BUY: 'buy',
  SELL: 'sell',
  HOLD: 'hold',
};

const horizonToGraphql: Record<DiaryHorizonValue, DiaryHorizon> = {
  '1m': 'ONE_MONTH',
  '3m': 'THREE_MONTHS',
  '1y': 'ONE_YEAR',
  long: 'LONG',
};

const horizonFromGraphql: Record<DiaryHorizon, DiaryHorizonValue> = {
  ONE_MONTH: '1m',
  THREE_MONTHS: '3m',
  ONE_YEAR: '1y',
  LONG: 'long',
};

const statusToGraphql: Record<DiaryStatusValue, DiaryStatus> = {
  active: 'ACTIVE',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

const statusFromGraphql: Record<DiaryStatus, DiaryStatusValue> = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export function toGraphqlDiaryAction(value: DiaryActionValue): DiaryAction {
  return actionToGraphql[value];
}

export function fromGraphqlDiaryAction(value: DiaryAction): DiaryActionValue {
  return actionFromGraphql[value];
}

export function toGraphqlDiaryHorizon(value: DiaryHorizonValue): DiaryHorizon {
  return horizonToGraphql[value];
}

export function fromGraphqlDiaryHorizon(value: DiaryHorizon): DiaryHorizonValue {
  return horizonFromGraphql[value];
}

export function toGraphqlDiaryStatus(value: DiaryStatusValue): DiaryStatus {
  return statusToGraphql[value];
}

export function fromGraphqlDiaryStatus(value: DiaryStatus): DiaryStatusValue {
  return statusFromGraphql[value];
}
