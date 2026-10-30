# Arquitetura Backend

Gestão de frota com marcas, modelos, veículos, usuários, sessão e auditoria. O frontend permite consultar e administrar os registros conforme permissões. SQL Server mantém o domínio relacional; MongoDB mantém auditoria; Redis e RabbitMQ atendem cache, controles operacionais e mensageria.

## Fluxo e casos de falha

1. /api/auth/register cria usuário; /api/auth/login valida credenciais e emite JWT com contexto de sessão. /api/auth/me consulta perfil; update/profile e update/password modificam dados; logout invalida sessionId. O JWT não é a única fonte de validade: a sessão também é verificada. Endpoints e decorators de permissão estão na referência do código.

2. Marca → modelo vinculado → veículo. VehiclesService valida existência do modelo e unicidade antes de persistir; normaliza placa para maiúsculas. O agregado registra placa, chassi, renavam, ano, modelId e autoria/datas. Busca filtra placa/modelo/marca com paginação (padrão página 1, limite 20). Regras detalhadas de formato estão nos DTOs/value objects, não apenas na entidade.

3. Leitura usa RepositoryCacheService quando repositoryCache está ativo; gravação usa UnitOfWork e invalida caches de lista/detalhe. Depois registra auditoria e publica eventos de domínio. O commit SQL e o envio a sistemas externos são etapas distintas: não descreva o fluxo como uma transação única envolvendo SQL, Mongo e broker.

4. AuditService publica no broker quando auditAsyncWorker está ativo. Se a publicação falha, enfileira outbox no Mongo; se isso também falha, tenta persistência direta. Com o toggle desligado, persiste diretamente. O relay roda somente no audit-worker, recupera entradas PROCESSING abandonadas e republica pendências em lotes com limite de tentativas. Monitore estados terminais e logs; fallback não elimina a possibilidade de falha de todas as dependências.

| Método e caminho | Declaração |
| --- | --- |
| `DELETE /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `DELETE /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `DELETE /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `GET /api/auth/me` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `GET /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `GET /api/brands` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `GET /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `GET /api/models` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `GET /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `GET /api/vehicles` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `PATCH /api/brands/:id` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `PATCH /api/models/:id` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `PATCH /api/vehicles/:id` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |
| `POST /api/auth/login` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/logout` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/register` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/update/password` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/auth/update/profile` | [backend/src/modules/auth/interfaces/http/auth.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/auth/interfaces/http/auth.controller.ts) |
| `POST /api/brands` | [backend/src/modules/fleet/interfaces/http/brands.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/brands.controller.ts) |
| `POST /api/models` | [backend/src/modules/fleet/interfaces/http/models.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/models.controller.ts) |
| `POST /api/vehicles` | [backend/src/modules/fleet/interfaces/http/vehicles.controller.ts](https://github.com/Vidigal-code/fleetcore-api/blob/a0b587d48f6701f76facddd40828cd47c0c6fbb2/backend/src/modules/fleet/interfaces/http/vehicles.controller.ts) |

## Exemplo de requisição

```http
POST /api/vehicles HTTP/1.1
Authorization: Bearer <access-token>
Content-Type: application/json

{"licensePlate":"ABC1D23","chassis":"9BWZZZ377VT004251","renavam":"12345678901","year":2024,"modelId":"00000000-0000-4000-8000-000000000001"}
```

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
