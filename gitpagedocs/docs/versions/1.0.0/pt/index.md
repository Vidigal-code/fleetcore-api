# Plataforma de Gestão de Frota · Aivacol

Este espaço documenta, em detalhes, a solução entregue para o teste técnico de backend da Aivacol. O objetivo é demonstrar transparência sobre decisões técnicas, mapear cada requisito do desafio e servir como referência rápida para manutenção ou auditoria.

## Como navegar

- **Introdução ao Desafio** — visão macro do produto, objetivos e artefatos.
- **Requisitos e Critérios** — checklist completo do enunciado e onde cada item foi atendido.
- **Arquitetura Backend** — módulos NestJS, camadas DDD e mecanismos de resiliência.
- **Modelagem de Dados e Domínio** — entidades, migrations e relacionamento entre tabelas.
- **Segurança, Auditoria e Mensageria** — JWT, RBAC, Redis, RabbitMQ e trilha em MongoDB.
- **Frontend e Experiência** — Next.js FSD, React Query, Redux Toolkit e design responsivo laranja.
- **Infraestrutura e Deployment** — Docker Compose, variáveis de ambiente, scripts e documentação.
- **Qualidade e Testes** — matriz de testes unitários/integrados/e2e, linting e monitoramento.
- **Guia de Execução e Troubleshooting** — passo a passo para subir ambientes e lidar com falhas.

## Stack em alto nível

- **Backend:** NestJS 11, TypeORM, SQL Server, Redis, RabbitMQ, MongoDB, Zod.
- **Frontend:** Next.js 14 (App Router), Redux Toolkit, React Query, Axios, Tailwind, Playwright.
- **Infra:** Docker Compose, scripts NPM, GitHub Pages para documentação GitPageDocs.

Cada página aprofunda o tópico correspondente e aponta diretamente para os arquivos e comandos relevantes dentro do repositório.

> Versão: 1.0.0
