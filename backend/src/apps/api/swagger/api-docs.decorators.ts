import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

/**
 * Helper único para descrições bilíngues (PT / EN), seguindo o padrão já usado
 * nos summaries. Centraliza a formatação para evitar repetição de código.
 */
export const bilingual = (pt: string, en: string): string => `${pt} / ${en}`;

const ERROR_DESCRIPTIONS = {
  badRequest: bilingual('Dados inválidos.', 'Invalid payload.'),
  unauthorized: bilingual(
    'Token JWT ausente ou inválido.',
    'Missing or invalid JWT token.',
  ),
  forbidden: bilingual(
    'Sem permissão para esta ação (RBAC).',
    'Insufficient role for this action (RBAC).',
  ),
  tooMany: bilingual('Limite de requisições excedido.', 'Rate limit exceeded.'),
} as const;

/** Erros comuns dos endpoints de autenticação (sem RBAC). */
export const ApiAuthErrors = () =>
  applyDecorators(
    ApiBadRequestResponse({ description: ERROR_DESCRIPTIONS.badRequest }),
    ApiUnauthorizedResponse({ description: ERROR_DESCRIPTIONS.unauthorized }),
    ApiTooManyRequestsResponse({ description: ERROR_DESCRIPTIONS.tooMany }),
  );

/** Erros comuns dos endpoints protegidos por JWT + RBAC. */
export const ApiProtectedErrors = () =>
  applyDecorators(
    ApiBadRequestResponse({ description: ERROR_DESCRIPTIONS.badRequest }),
    ApiUnauthorizedResponse({ description: ERROR_DESCRIPTIONS.unauthorized }),
    ApiForbiddenResponse({ description: ERROR_DESCRIPTIONS.forbidden }),
    ApiTooManyRequestsResponse({ description: ERROR_DESCRIPTIONS.tooMany }),
  );

/** 404 reutilizável, parametrizado pelo nome bilíngue da entidade. */
export const ApiResourceNotFound = (entityPt: string, entityEn: string) =>
  ApiNotFoundResponse({
    description: bilingual(
      `${entityPt} não encontrado(a).`,
      `${entityEn} not found.`,
    ),
  });

/** 200 OK com descrição bilíngue. */
export const ApiOk = (pt: string, en: string) =>
  ApiOkResponse({ description: bilingual(pt, en) });

/** 201 Created com descrição bilíngue. */
export const ApiCreated = (pt: string, en: string) =>
  ApiCreatedResponse({ description: bilingual(pt, en) });

/**
 * Cabeçalhos opcionais de rastreio que a API realmente lê (segurança/auditoria)
 * — permitem adicionar um header no "Try it out" para testar e rastrear a
 * requisição na trilha de auditoria. Não conflitam com o Bearer (Authorize).
 */
export const ApiTraceHeaders = () =>
  applyDecorators(
    ApiHeader({
      name: 'X-Correlation-Id',
      required: false,
      description: bilingual(
        'ID de correlação para rastrear a requisição na auditoria (gerado se ausente).',
        'Correlation ID to trace the request across the audit trail (generated when absent).',
      ),
      schema: { type: 'string', example: 'fleetcore-test-001' },
    }),
    ApiHeader({
      name: 'X-Request-Id',
      required: false,
      description: bilingual(
        'ID da requisição (gerado se ausente).',
        'Request ID (generated when absent).',
      ),
      schema: { type: 'string', example: 'req-001' },
    }),
  );
