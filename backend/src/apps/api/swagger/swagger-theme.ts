/**
 * Tema do Swagger UI alinhado à identidade Fleetcore (amarelo #F8BE0E +
 * petróleo #1B2D35). A estrutura visual é definida UMA única vez usando tokens
 * `--fc-*`; apenas os valores dos tokens mudam entre claro e escuro. Assim não
 * há duplicação de regras nem cores "misturadas" entre os temas — trocar o
 * esquema apenas reatribui os tokens.
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

const toThemeVariables = (palette: SwaggerPalette): string =>
  [
    `--fc-bg:${palette.bg}`,
    `--fc-surface:${palette.surface}`,
    `--fc-surface-alt:${palette.surfaceAlt}`,
    `--fc-border:${palette.border}`,
    `--fc-text:${palette.text}`,
    `--fc-muted:${palette.muted}`,
    `--fc-accent:${palette.accent}`,
    `--fc-accent-strong:${palette.accentStrong}`,
    `--fc-accent-contrast:${palette.accentContrast}`,
    `--fc-topbar:${palette.topbar}`,
    `--fc-code:${palette.code}`,
    `--fc-code-text:${palette.codeText}`,
  ]
    .map((line) => `${line};`)
    .join('');

// Regras estruturais — referenciam SOMENTE os tokens, então valem para os dois
// temas sem repetição.
const STRUCTURE_CSS = `
  body { background: var(--fc-bg); }
  .swagger-ui { color: var(--fc-text); }
  .swagger-ui .info .title,
  .swagger-ui .opblock-tag,
  .swagger-ui .opblock .opblock-summary-operation-id,
  .swagger-ui .opblock .opblock-summary-description,
  .swagger-ui table thead tr th,
  .swagger-ui .response-col_status,
  .swagger-ui label,
  .swagger-ui .parameter__name,
  .swagger-ui .model-title,
  .swagger-ui .model,
  .swagger-ui .models h4,
  .swagger-ui .tab li,
  .swagger-ui .opblock-summary-path { color: var(--fc-text); }
  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .parameter__type,
  .swagger-ui .parameter__in,
  .swagger-ui .renderedMarkdown p,
  .swagger-ui .response-col_description,
  .swagger-ui .info .base-url,
  .swagger-ui .opblock-summary-path__deprecated { color: var(--fc-muted); }
  .swagger-ui .scheme-container,
  .swagger-ui section.models,
  .swagger-ui .opblock .opblock-section-header {
    background: var(--fc-surface);
    box-shadow: none;
    border: 1px solid var(--fc-border);
  }
  .swagger-ui section.models .model-container { background: var(--fc-surface-alt); }
  .swagger-ui .info { margin: 28px 0; }
  .swagger-ui .topbar {
    background: var(--fc-topbar);
    border-bottom: 1px solid var(--fc-border);
    padding: 14px 0;
  }
  .swagger-ui .topbar .download-url-wrapper { display: none; }
  .swagger-ui .info .title small.version-stamp { background: var(--fc-accent); color: var(--fc-accent-contrast); }
  .swagger-ui .info a,
  .swagger-ui a.nostyle,
  .swagger-ui .info .title small { color: var(--fc-accent-strong); }
  .swagger-ui .btn.authorize { color: var(--fc-accent-strong); border-color: var(--fc-accent); }
  .swagger-ui .btn.authorize svg { fill: var(--fc-accent-strong); }
  .swagger-ui .btn.execute {
    background: var(--fc-accent);
    border-color: var(--fc-accent);
    color: var(--fc-accent-contrast);
    font-weight: 700;
  }
  .swagger-ui .opblock {
    border: 1px solid var(--fc-border);
    border-radius: 14px;
    background: var(--fc-surface);
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.18);
    margin: 0 0 16px;
  }
  .swagger-ui .opblock .opblock-summary { border-color: var(--fc-border); }
  .swagger-ui .opblock-tag { border-color: var(--fc-border); font-size: 18px; }
  .swagger-ui .opblock.opblock-get .opblock-summary-method { background: ${METHOD_COLORS.get}; }
  .swagger-ui .opblock.opblock-post .opblock-summary-method { background: ${METHOD_COLORS.post}; }
  .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: ${METHOD_COLORS.patch}; }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: ${METHOD_COLORS.delete}; }
  .swagger-ui .opblock-summary-method { border-radius: 8px; color: #fff; }
  .swagger-ui input[type=text],
  .swagger-ui input[type=password],
  .swagger-ui input[type=email],
  .swagger-ui input[type=number],
  .swagger-ui textarea,
  .swagger-ui select {
    background: var(--fc-surface-alt);
    color: var(--fc-text);
    border: 1px solid var(--fc-border);
    border-radius: 8px;
  }
  .swagger-ui .filter .operation-filter-input { border-radius: 10px; }
  .swagger-ui .model-box,
  .swagger-ui .highlight-code,
  .swagger-ui .microlight,
  .swagger-ui .responses-inner pre { background: var(--fc-code); color: var(--fc-code-text); }
  .swagger-ui .opblock-body pre.microlight { color: var(--fc-code-text); }
  .swagger-ui table thead tr th,
  .swagger-ui table tbody tr td { border-color: var(--fc-border); }
`;

/**
 * Monta o CSS do Swagger UI: tokens claros por padrão e tokens escuros sob
 * `prefers-color-scheme: dark`, seguidos das regras estruturais compartilhadas.
 */
export const buildSwaggerCss = (): string =>
  [
    `:root { color-scheme: light dark; ${toThemeVariables(SWAGGER_LIGHT_PALETTE)} }`,
    `@media (prefers-color-scheme: dark) { :root { ${toThemeVariables(SWAGGER_DARK_PALETTE)} } }`,
    STRUCTURE_CSS,
  ].join('\n');
