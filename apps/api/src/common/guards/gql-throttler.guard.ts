import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    if (context.getType() === 'http') {
      const http = context.switchToHttp();
      return { req: http.getRequest(), res: http.getResponse() };
    }

    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext<{
      req: Record<string, unknown>;
      res: Record<string, unknown>;
    }>();
    return { req: ctx.req, res: ctx.res };
  }
}
