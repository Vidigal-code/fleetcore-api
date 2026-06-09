# Back-end

Guia rápido dos endpoints, camadas e mecanismos de negócio da API NestJS.

## Endpoints principais

- CRUD de marcas, modelos e veículos em `fleet/interfaces/http`.
- Autenticação (`/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`).
- Documentação Swagger em `/docs` (EN) e `/docs-pt` (PT).

## Regras de negócio

- Serviços (`models.service.ts`, `vehicles.service.ts`) validam relacionamentos e disparam eventos.
- Cache Redis reduz consultas de busca e invalidações ocorrem após mutações.
- Mensagens RabbitMQ registram mudanças relevantes de veículos.

## Como aprofundar

- **Arquitetura Backend** descreve módulos e camadas no capítulo correspondente.
- **Modelagem de Dados e Domínio** detalha entidades, agregados e migrations.
- **Segurança, Auditoria e Mensageria** cobre guardas, auditoria e mensageria.
