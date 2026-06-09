# Qualidade e Operações

Visão condensada dos rituais de qualidade e das rotinas operacionais que sustentam o produto.

## Qualidade

- `npm run lint`, `npm test`, `npm run test:e2e` garantem padrões em backend e frontend.
- Cobertura Jest para serviços, guards e integrações.
- Playwright valida fluxos-chave do frontend.

## Operações

- Docker Compose levanta SQL Server, Redis, RabbitMQ, MongoDB, API e frontend.
- `npm run generate:openapi` e `npm run export:schemas` mantêm documentação e validação sincronizadas.
- Feature toggles permitem ajustar auditoria, cache e eventos sem alterar código.

## Referências

- [Qualidade e Testes](./08-testes-observabilidade.md)
- [Guia de Execução e Troubleshooting](./09-guia-execucao.md)
