import { ExecutionContext, Injectable, createParamDecorator } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthenticatedUser } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

export const RestCurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser | undefined => {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    return request.user;
  },
);
