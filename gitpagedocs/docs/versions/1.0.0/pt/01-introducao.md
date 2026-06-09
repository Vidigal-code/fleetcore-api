# Introdução ao Desafio

O teste técnico da **Aivacol** exige a construção de uma plataforma completa de gestão de frota. O repositório `fleetcore-api` entrega backend NestJS, frontend Next.js, infraestrutura Docker e documentação operacional, demonstrando domínio de arquitetura limpa, padrões corporativos e integração entre serviços.

## Objetivos resumidos

- Fornecer APIs REST confiáveis para cadastrar, consultar e manter **modelos**, **veículos** e **marcas**.
- Garantir **segurança corporativa** (JWT, RBAC, auditoria, trilha em MongoDB e mensageria via RabbitMQ).
- Oferecer **frontend** FSD responsivo com Redux Toolkit, React Query, Axios e theming personalizável.
- Empacotar tudo com **Docker Compose**, scripts de automação, testes Jest/Playwright e documentação bilingue.

## Componentes principais

| Pilar | Descrição | Pastas/Arquivos-chave |
|-------|-----------|------------------------|
| Backend API | NestJS 11 + TypeORM (SQL Server), DDD, Unit of Work, eventos de domínio, cache Redis | `backend/src/modules`, `backend/src/shared`, `backend/src/migrations` |
| Mensageria & Auditoria | RabbitMQ para eventos de frota, MongoDB para trilha auditável | `backend/src/modules/messaging`, `backend/src/modules/audit` |
| Segurança | JWT com RBAC, sessões armazenadas em Redis, interceptores de auditoria, sanitização | `backend/src/modules/auth`, `backend/src/apps/api/security` |
| Frontend Web | Next.js 14 (App Router), FSD, Redux Toolkit, React Query, temas laranja claro/escuro | `frontend/src/app`, `frontend/src/{entities,features,processes,shared,widgets}` |
| Infraestrutura | Docker Compose (SQL Server, Redis, RabbitMQ, Mongo, backend, frontend), scripts NPM | `docker-compose.yml`, `.env.example`, `backend/.env.sample`, `frontend/.env.sample` |
| Qualidade | Testes unitários, integração e e2e (Jest & Playwright), lint, GitHub Pages com docs | `backend/tests`, `frontend/tests`, `gitpagedocs/` |

## Organização da documentação

Esta Wiki está dividida em nove capítulos que mapeiam todo o desafio:

1. **Introdução ao Desafio** – visão geral, componentes e objetivos (esta página).
2. **Requisitos e Critérios** – checklist do enunciado com links diretos para a implementação.
3. **Arquitetura Backend** – módulos, padrões, fluxo de dados e resiliência.
4. **Modelagem de Dados e Domínio** – entidades, migrations e agregados DDD.
5. **Segurança, Auditoria e Mensageria** – mecanismos de proteção e observabilidade.
6. **Frontend e Experiência** – estrutura FSD, fluxo de dados cliente e UI responsiva.
7. **Infraestrutura e Deployment** – Docker, variáveis de ambiente, scripts e documentação.
8. **Qualidade e Testes** – suites de testes, cobertura e ferramentas de verificação.
9. **Guia de Execução e Troubleshooting** – como rodar o projeto e resolver falhas.

Use os botões “Próximo/Anterior” do GitPageDocs ou o índice lateral para navegar pelos temas conforme a necessidade.
