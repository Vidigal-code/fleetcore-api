# Front-end

Resumo do cliente Next.js e como ele consome as APIs da plataforma.

## Padrões adotados

- **Feature-Sliced Design (FSD):** camadas `entities`, `features`, `widgets`, `processes` e `shared`.
- **Redux Toolkit:** guarda autenticação e preferências.
- **React Query:** integrações REST com revalidação automática.

## Experiência visual

- Tema laranja claro/escuro configurável via `NEXT_PUBLIC_START_THEME`.
- Layout mobile-first com componentes reativos reutilizáveis.
- Mensagens inline e validações Zod compartilhadas com o backend.

## Próximos passos

- Consulte [Frontend e Experiência](./06-frontend.md) para detalhes aprofundados.
- Verifique [Qualidade e Testes](./08-testes-observabilidade.md) para conhecer as suítes RTL/Playwright.
