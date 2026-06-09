# Modelagem de Dados e Domínio

O desafio exige padronização de tabelas, metadados e relacionamentos. A implementação utiliza **TypeORM** com SQL Server, migrando toda a estrutura com o arquivo `1717845600000-InitSchema.ts`.

## Tabelas e colunas

| Tabela | Campos principais | Observações |
|--------|-------------------|-------------|
| `users` | `id`, `nickname`, `name`, `email`, `password_hash`, `roles`, `created_at`, `updated_at`, `created_by` | Seed do usuário `aivacol`; roles salvas como array serializado. |
| `brands` | `id`, `name`, metadados padrão | Regras de unicidade por nome. |
| `models` | `id`, `name`, `brand_id`, metadados | `brand_id` opcional (modelo pode existir sem marca) com `FK` `SET NULL`. |
| `vehicles` | `id`, `license_plate`, `chassis`, `renavam`, `year`, `model_id`, metadados | Restrições únicas para placa, chassi e renavam; `FK` para `models` com `CASCADE` em deleção. |

Todas as tabelas seguem o padrão obrigatório do desafio: `created_at`, `updated_at`, `created_by`.

## Agregados e entidades de domínio

- `User`, `Brand`, `Model`, `Vehicle` (em `backend/src/modules/*/domain`) encapsulam invariantes e oferecem métodos para atualizações controladas (`update`, `changeModel`, etc.).
- Eventos de domínio (`VehicleCreatedEvent`, `BrandUpdatedEvent`, etc.) acompanham snapshots do agregado para mensageria/auditoria.

## DTOs e validações

- DTOs em `backend/src/modules/fleet/dto` combinam `class-validator` com schemas Zod exportados para o frontend (`backend/scripts/export-schemas.ts`).
- Campos como `licensePlate` passam por normalização (`toUpperCase`) e regex Mercosul definida uma única vez (`fleet.schema.ts`).

## Repositórios TypeORM

- Repositórios específicos (`VehicleTypeOrmRepository`, `ModelTypeOrmRepository`, etc.) traduzem agregados para entidades TypeORM (`infrastructure/entities`).
- `UnitOfWork` recebe `EntityManager` do TypeORM e garante rollback em caso de erro.

## Seed e dados de exemplo

- `UsersService.ensureAdminSeed()` cria o usuário admin.
- `backend/seeds/seed_vehicles.json` contém dados simulados para importação manual (bonus exigido no enunciado).

## Por que atende aos requisitos

- A modelagem cobre as tabelas obrigatórias (`models`, `vehicles`) e os bônus (`brands`, `users`).
- Regras de integridade (FK, unique) asseguram padronização e evitam duplicidade.
- As entidades de domínio encapsulam as regras de negócio, mantendo os controladores enxutos e testáveis.
