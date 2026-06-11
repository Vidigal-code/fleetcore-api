'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type SelectHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  FIELD_BASE_CLASSES,
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_TEXT_CLASSES,
  FIELD_LABEL_WRAPPER_CLASSES,
} from '@/shared/ui/field-styles';

export interface SelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  error?: string | null;
  hint?: string;
  placeholder?: string;
}

const TRIGGER_CLASSES = cn(
  FIELD_BASE_CLASSES,
  'relative flex cursor-pointer items-center justify-between gap-3 pr-12 text-left disabled:cursor-not-allowed disabled:opacity-60',
);

// O painel e renderizado via portal (document.body) com posicao fixa, escapando
// de qualquer stacking context / overflow dos cards pais. zIndex alto garante
// que o dropdown nunca fique atras de outro container.
const PANEL_CLASSES =
  'fixed z-[1000] overflow-auto rounded-2xl border border-border/60 bg-surface/95 p-1.5 shadow-elevated backdrop-blur-xl';

const OPTION_BASE_CLASSES =
  'flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-left text-sm transition-colors duration-base ease-subtle';

const PANEL_GAP = 8;
const PANEL_MAX_HEIGHT = 256;

interface PanelPosition {
  style: CSSProperties;
}

// Define o valor de um <select> nativo de forma que o React detecte a mudanca
// (necessario para inputs controlados): usamos o setter do prototype para
// contornar o "value tracker" do React e disparamos um evento change que
// propaga para o onChange original (RHF, handlers controlados, etc.).
function setNativeSelectValue(node: HTMLSelectElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLSelectElement.prototype,
    'value',
  )?.set;
  if (setter) {
    setter.call(node, value);
  } else {
    node.value = value;
  }
  node.dispatchEvent(new Event('change', { bubbles: true }));
}

function computePanelStyle(trigger: HTMLElement): CSSProperties {
  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openUp = spaceBelow < PANEL_MAX_HEIGHT + PANEL_GAP && spaceAbove > spaceBelow;
  const available = (openUp ? spaceAbove : spaceBelow) - PANEL_GAP * 2;
  const maxHeight = Math.max(120, Math.min(PANEL_MAX_HEIGHT, available));

  const base: CSSProperties = {
    left: rect.left,
    width: rect.width,
    maxHeight,
  };

  return openUp
    ? { ...base, bottom: window.innerHeight - rect.top + PANEL_GAP }
    : { ...base, top: rect.bottom + PANEL_GAP };
}

/**
 * Select customizado: renderiza um dropdown estilizado (consistente com o tema)
 * em vez do controle nativo do navegador, mas mantem um <select> nativo oculto
 * como fonte de verdade. Assim a integracao com formularios (react-hook-form
 * via register, value/onChange controlado, reset e submit) continua funcionando
 * sem mudancas nos pontos de uso. O painel usa portal + posicao fixa para nunca
 * ficar atras de outro elemento.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { className, label, options, error, hint, placeholder, id, disabled, ...props },
    ref,
  ) => {
    const reactId = useId();
    const selectId = id ?? props.name ?? reactId;
    const labelId = `${selectId}-label`;
    const listId = `${selectId}-listbox`;
    const triggerId = `${selectId}-trigger`;

    const innerRef = useRef<HTMLSelectElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLUListElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [panel, setPanel] = useState<PanelPosition | null>(null);

    // Espelha o valor real do <select> nativo no gatilho customizado. Roda a
    // cada render para tambem capturar mudancas programaticas (reset/setValue do
    // RHF, value controlado) que nao disparam o evento change.
    // Intencionalmente sem array de dependencias: precisa rodar a cada render
    // para capturar mudancas programaticas do valor (reset/setValue do RHF). O
    // guard de igualdade evita qualquer loop de atualizacao.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useLayoutEffect(() => {
      const node = innerRef.current;
      if (node && node.value !== currentValue) {
        setCurrentValue(node.value);
      }
    });

    const setRef = (node: HTMLSelectElement | null): void => {
      innerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const close = useCallback(() => {
      setIsOpen(false);
      setActiveIndex(-1);
      setPanel(null);
    }, []);

    const reposition = useCallback(() => {
      if (triggerRef.current) {
        setPanel({ style: computePanelStyle(triggerRef.current) });
      }
    }, []);

    // Reposiciona o painel ao abrir e mantem alinhado em scroll/resize.
    useEffect(() => {
      if (!isOpen) return;
      reposition();
      const handle = () => reposition();
      window.addEventListener('scroll', handle, true);
      window.addEventListener('resize', handle);
      return () => {
        window.removeEventListener('scroll', handle, true);
        window.removeEventListener('resize', handle);
      };
    }, [isOpen, reposition]);

    // Fecha ao clicar fora (gatilho ou painel) ou pressionar Escape. O painel
    // vive em portal, entao verificamos os dois refs separadamente.
    useEffect(() => {
      if (!isOpen) return;
      const handlePointerDown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          !triggerRef.current?.contains(target) &&
          !panelRef.current?.contains(target)
        ) {
          close();
        }
      };
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') close();
      };
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, close]);

    const openMenu = (): void => {
      if (disabled) return;
      const selectedIndex = options.findIndex(
        (option) => String(option.value) === currentValue,
      );
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setIsOpen(true);
    };

    const selectValue = (value: string): void => {
      const node = innerRef.current;
      if (node) {
        setNativeSelectValue(node, value);
      }
      setCurrentValue(value);
      close();
    };

    const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      if (disabled) return;
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp': {
          event.preventDefault();
          if (!isOpen) {
            openMenu();
            return;
          }
          setActiveIndex((prev) => {
            const next = event.key === 'ArrowDown' ? prev + 1 : prev - 1;
            if (next < 0) return options.length - 1;
            if (next >= options.length) return 0;
            return next;
          });
          return;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (!isOpen) {
            openMenu();
            return;
          }
          const option = options[activeIndex];
          if (option) {
            selectValue(String(option.value));
          }
          return;
        }
        case 'Escape': {
          if (isOpen) {
            event.preventDefault();
            close();
          }
          return;
        }
        default:
          return;
      }
    };

    const selectedOption = options.find(
      (option) => String(option.value) === currentValue,
    );
    const isPlaceholder = !selectedOption;
    const triggerLabel = selectedOption?.label ?? placeholder ?? '';

    return (
      <div className={cn(FIELD_LABEL_WRAPPER_CLASSES, className)}>
        {label ? (
          <span id={labelId} className={FIELD_LABEL_TEXT_CLASSES}>
            {label}
          </span>
        ) : null}

        <div className="relative w-full">
          {/* Select nativo oculto: fonte de verdade para formularios e submit. */}
          <select
            ref={setRef}
            id={selectId}
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            className="sr-only"
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            ref={triggerRef}
            type="button"
            id={triggerId}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-labelledby={label ? `${labelId} ${triggerId}` : undefined}
            disabled={disabled}
            onClick={() => (isOpen ? close() : openMenu())}
            onKeyDown={handleKeyDown}
            className={cn(TRIGGER_CLASSES, error && FIELD_ERROR_CLASSES)}
          >
            <span className={cn('truncate', isPlaceholder && 'text-muted')}>
              {triggerLabel || ' '}
            </span>
            <ChevronDown
              className={cn(
                'pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted transition-transform duration-base',
                isOpen && 'rotate-180',
              )}
            />
          </button>

          {isOpen && panel && typeof document !== 'undefined'
            ? createPortal(
                <ul
                  ref={panelRef}
                  id={listId}
                  role="listbox"
                  aria-labelledby={label ? labelId : undefined}
                  style={panel.style}
                  className={PANEL_CLASSES}
                >
                  {options.length === 0 ? (
                    <li className="px-4 py-2.5 text-sm text-muted">Nenhuma opção</li>
                  ) : (
                    options.map((option, index) => {
                      const isSelected = String(option.value) === currentValue;
                      const isActive = index === activeIndex;
                      return (
                        <li key={option.value} role="option" aria-selected={isSelected}>
                          <button
                            type="button"
                            tabIndex={-1}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => selectValue(String(option.value))}
                            className={cn(
                              OPTION_BASE_CLASSES,
                              isActive
                                ? 'bg-accent/10 text-accent'
                                : 'text-foreground hover:bg-accent/10 hover:text-accent',
                              isSelected && 'text-accent',
                            )}
                          >
                            <span className="truncate">{option.label}</span>
                            {isSelected ? <Check className="h-4 w-4 shrink-0" /> : null}
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>,
                document.body,
              )
            : null}
        </div>

        {error ? (
          <span className="text-xs font-semibold text-danger" role="alert">
            {error}
          </span>
        ) : hint ? (
          <span className="text-xs text-muted">{hint}</span>
        ) : null}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
