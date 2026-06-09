# Visão Geral do Projeto

Este resumo apresenta os pilares da plataforma de gestão de frotas antes de mergulhar nos capítulos detalhados.

## Objetivo

Entregar uma solução completa (backend, frontend, infraestrutura e documentação) que comprove aderência total ao desafio técnico da Aivacol.

## Componentes principais

- **Arquitetura** — veja [Arquitetura Backend](./03-arquitetura-backend.md) e [Modelagem de Dados](./04-modelagem-dominio.md) para entender módulos, camadas e entidades.
- **Segurança e observabilidade** — consulte [Segurança, Auditoria e Mensageria](./05-seguranca-mensageria.md) para conhecer estratégias de RBAC, auditoria e RabbitMQ.
- **Experiência digital** — em [Frontend e Experiência](./06-frontend.md) estão o padrão FSD, os temas laranja e o fluxo de dados.
- **Qualidade operacional** — [Qualidade e Testes](./08-testes-observabilidade.md) e [Guia de Execução](./09-guia-execucao.md) cobrem as rotinas de QA e troubleshooting.

## Resultado alcançado

- APIs NestJS com DDD, cache Redis e eventos RabbitMQ.
- Frontend Next.js responsivo compartilhando esquemas Zod com o backend.
- Stack Docker Compose com SQL Server, Redis, RabbitMQ e MongoDB.
- Documentação bilíngue com roteamento unificado via GitPageDocs.

Siga para as demais seções conforme o tema que deseja explorar em mais detalhe.
