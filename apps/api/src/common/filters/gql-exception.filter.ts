import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { GqlArgumentsHost, type GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

@Catch()
export class GqlExceptionFilter {
  private readonly logger = new Logger(GqlExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): GraphQLError {
    if (host.getType<GqlContextType>() !== 'graphql') {
      throw exception;
    }

    const gqlHost = GqlArgumentsHost.create(host);
    const operation = gqlHost.getInfo()?.fieldName ?? 'unknown';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      const message =
        typeof response === 'string'
          ? response
          : ((response as { message?: string | string[] }).message ?? exception.message);

      const normalizedMessage = Array.isArray(message) ? message.join(', ') : message;

      if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.error(`GraphQL ${operation}: ${normalizedMessage}`, exception.stack);
      }

      return new GraphQLError(normalizedMessage, {
        extensions: {
          code: this.statusToCode(status),
          status,
        },
      });
    }

    this.logger.error(`GraphQL ${operation}: unhandled error`, exception);

    return new GraphQLError('Internal server error', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    });
  }

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'TOO_MANY_REQUESTS',
    };
    return map[status] ?? 'INTERNAL_SERVER_ERROR';
  }
}
