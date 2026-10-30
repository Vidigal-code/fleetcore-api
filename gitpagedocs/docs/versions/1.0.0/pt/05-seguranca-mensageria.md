# Segurança, Auditoria e Mensageria

Gestão de frota com marcas, modelos, veículos, usuários, sessão e auditoria. O frontend permite consultar e administrar os registros conforme permissões. SQL Server mantém o domínio relacional; MongoDB mantém auditoria; Redis e RabbitMQ atendem cache, controles operacionais e mensageria.

## Contratos de dados

Autenticação, roles, rate limiting, idempotência, locks e cache têm módulos próprios. Ative e configure controles conforme AppConfig/feature toggles, sem pressupor que instalar Redis habilita tudo. Auditoria e logs devem ser consultados por correlationId/requestId quando presentes. Frontend usa contratos OpenAPI e schemas; o backend aplica validação e autorização. Tipos gerados não devem ser editados como fonte principal.

## Fluxo e casos de falha

/api/auth/register cria usuário; /api/auth/login valida credenciais e emite JWT com contexto de sessão. /api/auth/me consulta perfil; update/profile e update/password modificam dados; logout invalida sessionId. O JWT não é a única fonte de validade: a sessão também é verificada. Endpoints e decorators de permissão estão na referência do código.

Copie envexample.txt para .env; Compose sobe SQL Server/inicializador, Redis, Mongo, RabbitMQ, API, audit-worker e frontend. Suba ambos os processos backend para o fluxo assíncrono. Use scripts generate:openapi/export:schemas/generate:client com API disponível; generate:client referencia docs-json em localhost:3000. Rode backend test/test:e2e/build e frontend test/test:e2e/lint/build conforme dependências do harness. Para lista antiga, confira invalidação/toggle; auditoria ausente, worker/broker/outbox/Mongo; 401 após login, sessão/Redis/segredo. Terraform em infra descreve infraestrutura; a atualização documental não aplica recursos cloud.

## Arquivos relacionados

- [backend/src/modules/fleet/application/vehicles.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/application/vehicles.service.ts)
- [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts)
- [backend/src/modules/audit/audit.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/audit.service.ts)
- [backend/src/modules/audit/relays/audit-outbox-relay.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/audit/relays/audit-outbox-relay.service.ts)
- [backend/src/shared/features/feature-toggle.service.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/shared/features/feature-toggle.service.ts)
- [docker-compose.yml](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/docker-compose.yml)

## Navegação

- [Project guide](?menu=pt&lang=pt&id=18)
- [Source reference](?menu=pt&lang=pt&id=19)
