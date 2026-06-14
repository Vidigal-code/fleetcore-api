# Modelagem de Dados e Domínio

O backend usa TypeORM com SQL Server e um modelo orientado a agregados. A migração única `backend/src/migrations/1717845600000-InitSchema.ts` provisiona tabelas, índices, chaves estrangeiras e metadados (`created_at`, `updated_at`, `created_by`).

## Esquema relacional

| Tabela | Campos principais | Relacionamentos |
|--------|-------------------|-----------------|
| `users` | `id`, `nickname`, `email`, `password_hash`, `roles` | Usuário admin `aivacol` semeado no bootstrap; roles armazenadas como CSV. |
| `brands` | `id`, `name` | Nome único; opcionalmente referenciada por modelos. |
| `models` | `id`, `name`, `brand_id` | FK com `SET NULL` permitindo modelos sem marca. |
| `vehicles` | `id`, `license_plate`, `chassis`, `renavam`, `model_id` | Restrições únicas para identificadores; FK com `CASCADE` em deleções. |

O arquivo `backend/seeds/seed_vehicles.json` oferece dados simulados para inicialização local.

## Coleção de auditoria (MongoDB)

A trilha de auditoria não fica no SQL Server: é persistida na coleção `audit_events` do MongoDB (`backend/src/modules/audit/schemas/audit-event.schema.ts`). O documento é gravado pelo worker de auditoria com os campos enriquecidos do evento mais metadados de processamento:

| Grupo | Campos |
|-------|--------|
| Identidade do evento | `eventId`, `eventType`, `correlationId`, `requestId` |
| Ator/sessão | `actor`, `userId`, `sessionId` |
| Requisição | `method`, `route`, `action`, `statusCode`, `success` |
| Entidade | `entity`, `entityId`, `payload`, `metadata`, `occurredAt` |
| Processamento | `status` (`processed`), `retries`, `sourceQueue`, `processedAt` |

Os campos enriquecidos são opcionais (compatível com documentos antigos), e a escrita usa `ResilienceService` (retry/fallback).

## Agregados e repositórios

- Agregados `Brand`, `Model`, `Vehicle` e `User` (pasta `backend/src/modules/**/domain`) garantem invariantes como unicidade, validação de placa e composição de roles.
- Repositórios TypeORM (`backend/src/modules/fleet/infrastructure/repositories`) implementam contratos definidos na camada de domínio.
- `UnitOfWork` (`backend/src/shared/unit-of-work/unit-of-work.ts`) administra transações do `EntityManager`, mantendo operações atômicas.
- Eventos de domínio em `backend/src/modules/fleet/domain/events` alimentam cache, auditoria e mensageria.

## Validação compartilhada

- DTOs combinam `class-validator` com esquemas Zod definidos em `backend/src/shared/validation/fleet.schema.ts`.
- `npm run export:schemas` gera versões consumidas pelo frontend em `frontend/src/shared/schemas`, garantindo mensagens idênticas nas duas camadas.
- Regras como regex Mercosul, tamanho do chassi, estrutura do RENAVAM e faixa de anos vivem nesses esquemas reutilizáveis.

## Fluxo típico

1. Controllers recebem DTOs e encaminham para os services.
2. Services carregam agregados via repositórios dentro de um `UnitOfWork`, aplicam regras e persistem mudanças.
3. Agregados emitem eventos (`VehicleCreatedEvent`, `ModelUpdatedEvent`, etc.) que disparam cache, auditoria e mensageria.

Essa abordagem mantém regras de negócio próximas ao domínio, reduz duplicidade entre camadas e possibilita que backend e frontend compartilhem a mesma lógica de validação.
