import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { AuthenticatedUser } from '../auth.service';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined => {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{ req?: { user?: AuthenticatedUser } }>().req;

    return request?.user;
  },
);
