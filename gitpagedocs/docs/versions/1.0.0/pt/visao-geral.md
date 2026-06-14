# Visão Geral do Projeto

Este resumo apresenta os pilares da plataforma de gestão de frotas antes de mergulhar nos capítulos detalhados.

## Objetivo

Entregar uma solução completa (backend, frontend, infraestrutura e documentação) que comprove aderência total ao desafio técnico da Aivacol.

## Componentes principais

- **Arquitetura** — módulos, camadas e entidades disponíveis nas seções Arquitetura Backend e Modelagem de Dados do menu principal.
- **Segurança e observabilidade** — RBAC, sessões Redis com TTL deslizante e lock, rate limit dedicado, idempotência, lock distribuído, auditoria enriquecida e RabbitMQ centralizadas na seção Segurança, Auditoria e Mensageria.
- **Experiência digital** — padrão FSD, tema amarelo (claro/escuro) e fluxo de dados descritos na área Frontend e Experiência.
- **Qualidade operacional** — rotinas de QA e troubleshooting detalhadas nas seções Qualidade e Testes e Guia de Execução.

## Resultado alcançado

- APIs NestJS com DDD, cache Redis, lock distribuído, idempotência, rate limit e eventos RabbitMQ.
- Frontend Next.js responsivo compartilhando esquemas Zod com o backend.
- Stack Docker Compose com SQL Server, Redis, RabbitMQ e MongoDB.
- Documentação bilíngue com roteamento unificado via GitPageDocs.

Siga para as demais seções conforme o tema que deseja explorar em mais detalhe.
