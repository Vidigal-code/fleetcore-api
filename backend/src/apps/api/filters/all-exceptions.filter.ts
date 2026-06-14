import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

/**
 * Filtro global: respostas de erro consistentes para TODA exceção.
 * - HttpException: preserva status e payload originais (acrescenta timestamp/path).
 * - Erro inesperado (ex.: falha do TypeORM): loga o stack e devolve um 500
 *   genérico, sem vazar detalhes internos ao cliente.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = this.resolveStatus(exception);
    const body = this.buildBody(exception, status, request.url);

    if (!(exception instanceof HttpException)) {
      this.logger.error(
        `Unhandled error on ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json(body);
  }

  private resolveStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private buildBody(
    exception: unknown,
    status: number,
    path: string,
  ): ErrorBody {
    const base = { timestamp: new Date().toISOString(), path };
    const fallbackError = HttpStatus[status] ?? 'Error';

    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'object' && payload !== null) {
        const obj = payload as Record<string, unknown>;
        return {
          statusCode:
            typeof obj.statusCode === 'number' ? obj.statusCode : status,
          message: (obj.message as string | string[]) ?? fallbackError,
          error: (obj.error as string) ?? fallbackError,
          ...base,
        };
      }
      return {
        statusCode: status,
        message: String(payload),
        error: fallbackError,
        ...base,
      };
    }

    return {
      statusCode: status,
      message: 'Internal server error',
      error: 'Internal Server Error',
      ...base,
    };
  }
}
