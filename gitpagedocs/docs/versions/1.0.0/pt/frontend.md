# Front-end

Resumo do cliente Next.js e como ele consome as APIs da plataforma.

## Padrões adotados

- **Feature-Sliced Design (FSD):** camadas `app`, `processes`, `entities`, `features`, `widgets` e `shared`.
- **Redux Toolkit:** guarda **apenas** o estado de autenticação (o tema não fica no Redux).
- **React Query:** conduz o CRUD da frota com revalidação e invalidação automática nas mutações.

## Experiência visual

- Tema **amarelo** claro/escuro com as cores no `globals.css` (fonte única de verdade), aplicado via `ThemeProvider` + classe `light`/`dark` e persistido no `localStorage` (`fleetcore.theme-preference`). O padrão inicial vem de `NEXT_PUBLIC_START_THEME`.
- Layout mobile-first com componentes reativos reutilizáveis.
- Mensagens inline e validações Zod compartilhadas com o backend.

## UX de CRUD

- `ConfirmDialog` reutilizável substitui o `window.confirm` nas exclusões.
- Edição em `Modal` (vehicle-workbench e reference-data-board).
- `SelectField` customizado (dropdown com portal e navegação por teclado) sobre um `<select>` nativo oculto.

## Próximos passos

- Consulte a seção Frontend e Experiência para detalhes aprofundados.
- Verifique a seção Qualidade e Testes para conhecer as suítes RTL/Playwright.
