# Perguntas Conceituais

Esta página antecipa respostas curtas para questionamentos comuns durante a avaliação técnica.

## Por que DDD e módulos isolados?

Para manter dependências claras, facilitar testes unitários e permitir evolução independente dos contextos de frota, usuários, auditoria e mensageria. Detalhes adicionais estão na seção Arquitetura Backend.

## Como a segurança garante revogação de sessão?

`AuthSessionService` mantém tokens em Redis com TTL e remove sessões no logout, permitindo revogar acessos específicos sem derrubar todos os tokens. Consulte a seção Segurança, Auditoria e Mensageria.

## Como o frontend compartilha regras de validação?

Esquemas Zod são exportados do backend (`npm run export:schemas`) e importados no FSD, garantindo mensagens consistentes. Veja a seção Frontend e Experiência.

## Qual é o plano de observabilidade?

Logs estruturados, auditoria em MongoDB, eventos RabbitMQ e métricas permitem rastrear incidentes e levantar alertas. Referência disponível na seção Qualidade e Testes.
