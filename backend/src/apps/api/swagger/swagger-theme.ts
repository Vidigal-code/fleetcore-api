/**
 * Tema do Swagger UI alinhado à identidade Fleetcore (amarelo #F8BE0E +
 * petróleo #1B2D35). A estrutura visual é definida UMA única vez como uma lista
 * de regras (dados); apenas os valores dos tokens `--fc-*` mudam entre claro e
 * escuro. Assim não há duplicação nem cores "misturadas" entre os temas.
 *
 * Todas as regras são escopadas sob `body .swagger-ui` para vencer, por
 * especificidade, o stylesheet padrão do Swagger (que é injetado depois do
 * customCss e usa apenas seletores de classe).
 */

export interface SwaggerPalette {
  readonly bg: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly muted: string;
  readonly accent: string;
  readonly accentStrong: string;
  readonly accentContrast: string;
  readonly topbar: string;
  readonly code: string;
  readonly codeText: string;
}

/** Cores semânticas dos métodos HTTP — estáveis e legíveis nos dois temas. */
const METHOD_COLORS = {
  get: '#2563eb',
  post: '#16a34a',
  patch: '#d97706',
  delete: '#dc2626',
} as const;

export const SWAGGER_LIGHT_PALETTE: SwaggerPalette = {
  bg: '#f4f4f4',
  surface: '#ffffff',
  surfaceAlt: '#f1efe8',
  border: '#d8cba1',
  text: '#222222',
  muted: '#5a5442',
  accent: '#f8be0e',
  accentStrong: '#9c7a00',
  accentContrast: '#1b2d35',
  topbar: '#1b2d35',
  code: '#14202a',
  codeText: '#e2e8f0',
};

export const SWAGGER_DARK_PALETTE: SwaggerPalette = {
  bg: '#12191e',
  surface: '#1b272d',
  surfaceAlt: '#243640',
  border: '#33474f',
  text: '#f4f4f4',
  muted: '#a8b4ba',
  accent: '#f8be0e',
  accentStrong: '#fbd048',
  accentContrast: '#1b2d35',
  topbar: '#14222a',
  code: '#0d161c',
  codeText: '#e2e8f0',
};

const ROOT = 'body .swagger-ui';

interface ThemeRule {
  /** Seletores relativos ao ROOT ('' = o próprio ROOT). */
  readonly selectors: string[];
  readonly style: string;
}

const THEME_RULES: ThemeRule[] = [
  // Texto base e títulos
  {
    selectors: ['', '.wrapper', '.information-container'],
    style: 'color:var(--fc-text);',
  },
  {
    selectors: [
      '.info .title',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      '.opblock-tag',
      '.opblock .opblock-summary-operation-id',
      '.opblock .opblock-summary-description',
      '.opblock-title',
      'table thead tr th',
      '.response-col_status',
      'label',
      '.parameter__name',
      '.prop-type',
      '.model-title',
      '.model',
      '.models h4',
      '.opblock-section-header label',
      '.opblock-section-header h4',
      '.opblock-summary-path',
    ],
    style: 'color:var(--fc-text);',
  },
  // Texto secundário
  {
    selectors: [
      '.opblock-description-wrapper p',
      '.parameter__type',
      '.parameter__in',
      '.renderedMarkdown p',
      '.response-col_description',
      '.info .base-url',
      '.parameters-col_description',
      '.response-control-media-type__accept-message',
      '.tab li button.tablinks',
    ],
    style: 'color:var(--fc-muted);',
  },
  {
    selectors: ['.tab li button.tablinks.active'],
    style: 'color:var(--fc-text);',
  },
  // Superfícies
  {
    selectors: [
      '.scheme-container',
      'section.models',
      '.opblock .opblock-section-header',
    ],
    style:
      'background:var(--fc-surface);box-shadow:none;border:1px solid var(--fc-border);',
  },
  {
    selectors: ['section.models .model-container', '.model-box'],
    style: 'background:var(--fc-surface-alt);',
  },
  { selectors: ['.info'], style: 'margin:28px 0;' },
  // Topbar petróleo
  {
    selectors: ['.topbar'],
    style:
      'background:var(--fc-topbar);border-bottom:1px solid var(--fc-border);padding:14px 0;',
  },
  { selectors: ['.topbar .download-url-wrapper'], style: 'display:none;' },
  // Links e versão
  {
    selectors: ['.info .title small.version-stamp'],
    style: 'background:var(--fc-accent);color:var(--fc-accent-contrast);',
  },
  {
    selectors: ['.info a', 'a.nostyle', '.info .title small'],
    style: 'color:var(--fc-accent-strong);',
  },
  // Botões
  {
    selectors: ['.btn'],
    style: 'color:var(--fc-text);border-color:var(--fc-border);',
  },
  {
    selectors: ['.btn.authorize'],
    style: 'color:var(--fc-accent-strong);border-color:var(--fc-accent);',
  },
  { selectors: ['.btn.authorize svg'], style: 'fill:var(--fc-accent-strong);' },
  {
    selectors: ['.btn.execute'],
    style:
      'background:var(--fc-accent);border-color:var(--fc-accent);color:var(--fc-accent-contrast);font-weight:700;',
  },
  // Operações
  {
    selectors: ['.opblock'],
    style:
      'border:1px solid var(--fc-border);border-radius:14px;background:var(--fc-surface);box-shadow:0 8px 24px rgba(2,6,23,0.18);margin:0 0 16px;',
  },
  {
    selectors: ['.opblock .opblock-summary'],
    style: 'border-color:var(--fc-border);',
  },
  {
    selectors: ['.opblock-tag'],
    style: 'border-color:var(--fc-border);font-size:18px;',
  },
  {
    selectors: ['.opblock.opblock-get .opblock-summary-method'],
    style: `background:${METHOD_COLORS.get};`,
  },
  {
    selectors: ['.opblock.opblock-post .opblock-summary-method'],
    style: `background:${METHOD_COLORS.post};`,
  },
  {
    selectors: ['.opblock.opblock-patch .opblock-summary-method'],
    style: `background:${METHOD_COLORS.patch};`,
  },
  {
    selectors: ['.opblock.opblock-delete .opblock-summary-method'],
    style: `background:${METHOD_COLORS.delete};`,
  },
  {
    selectors: ['.opblock-summary-method'],
    style: 'border-radius:8px;color:#fff;',
  },
  // Campos de formulário
  {
    selectors: [
      'input[type=text]',
      'input[type=password]',
      'input[type=email]',
      'input[type=number]',
      'textarea',
      'select',
    ],
    style:
      'background:var(--fc-surface-alt);color:var(--fc-text);border:1px solid var(--fc-border);border-radius:8px;',
  },
  {
    selectors: ['.filter .operation-filter-input'],
    style: 'border-radius:10px;',
  },
  // Blocos de código
  {
    selectors: [
      '.highlight-code',
      '.microlight',
      '.responses-inner pre',
      '.opblock-body pre.microlight',
    ],
    style: 'background:var(--fc-code);color:var(--fc-code-text);',
  },
  {
    selectors: ['.renderedMarkdown code', '.markdown code'],
    style:
      'background:var(--fc-code);color:var(--fc-code-text);padding:1px 6px;border-radius:6px;',
  },
  {
    selectors: ['table thead tr th', 'table tbody tr td'],
    style: 'border-color:var(--fc-border);',
  },
  // Modal de autorização
  {
    selectors: ['.dialog-ux .modal-ux'],
    style: 'background:var(--fc-surface);border:1px solid var(--fc-border);',
  },
  {
    selectors: [
      '.dialog-ux .modal-ux-header h3',
      '.dialog-ux .modal-ux-content h4',
      '.dialog-ux .modal-ux-content p',
      '.dialog-ux .modal-ux-content label',
    ],
    style: 'color:var(--fc-text);',
  },
  {
    selectors: ['.dialog-ux .modal-ux-header'],
    style: 'border-bottom:1px solid var(--fc-border);',
  },
  { selectors: ['.auth-container'], style: 'border-color:var(--fc-border);' },
  {
    selectors: ['.errors-wrapper'],
    style:
      'background:var(--fc-surface-alt);border-color:var(--fc-border);color:var(--fc-text);',
  },
];

// Mapa token -> valor concreto da paleta. Usamos substituição em tempo de build
// (sem custom properties no :root) porque o Swagger UI não resolve variáveis
// definidas via customCss de forma confiável — o resultado seria var() vazio e
// as regras seriam descartadas.
const tokenMap = (palette: SwaggerPalette): Record<string, string> => ({
  '--fc-bg': palette.bg,
  '--fc-surface': palette.surface,
  '--fc-surface-alt': palette.surfaceAlt,
  '--fc-border': palette.border,
  '--fc-text': palette.text,
  '--fc-muted': palette.muted,
  '--fc-accent': palette.accent,
  '--fc-accent-strong': palette.accentStrong,
  '--fc-accent-contrast': palette.accentContrast,
  '--fc-topbar': palette.topbar,
  '--fc-code': palette.code,
  '--fc-code-text': palette.codeText,
});

const resolveTokens = (style: string, palette: SwaggerPalette): string => {
  const map = tokenMap(palette);
  return style.replace(
    /var\((--fc-[a-z-]+)\)/g,
    (_match, name: string) => map[name] ?? 'inherit',
  );
};

// Marca cada declaração como !important para vencer o tema nativo (.dark-mode)
// do Swagger UI v5 sem depender de adivinhar a especificidade do bundle.
const withImportant = (style: string): string =>
  style
    .split(';')
    .map((decl) => decl.trim())
    .filter(Boolean)
    .map((decl) => `${decl} !important`)
    .join(';');

const renderRule = (rule: ThemeRule, palette: SwaggerPalette): string => {
  const selector = rule.selectors
    .map((part) => (part ? `${ROOT} ${part}` : ROOT))
    .join(',');
  return `${selector}{${withImportant(resolveTokens(rule.style, palette))}}`;
};

const renderTheme = (palette: SwaggerPalette): string =>
  [
    `body{background:${palette.bg} !important;}`,
    ...THEME_RULES.map((rule) => renderRule(rule, palette)),
  ].join('\n');

/**
 * Monta o CSS do Swagger UI: regras com valores claros por padrão e o mesmo
 * conjunto de regras com valores escuros sob `prefers-color-scheme: dark`.
 * A lista de regras é única (DRY); só os valores da paleta mudam.
 */
export const buildSwaggerCss = (): string =>
  [
    ':root { color-scheme: light dark; }',
    renderTheme(SWAGGER_LIGHT_PALETTE),
    `@media (prefers-color-scheme: dark) {\n${renderTheme(SWAGGER_DARK_PALETTE)}\n}`,
  ].join('\n');
