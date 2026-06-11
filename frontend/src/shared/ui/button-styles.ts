import { cn } from '@/shared/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export const BUTTON_BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-full border font-semibold uppercase transition-all duration-base ease-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

export const BUTTON_VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-accent text-accent-foreground shadow-lg shadow-accent/25 hover:bg-accent-strong hover:text-accent-foreground',
  secondary:
    'border-border/60 bg-surface/90 text-foreground hover:border-accent/50 hover:bg-accent/15 hover:text-accent',
  ghost:
    'border-border/40 bg-transparent text-muted hover:border-accent/60 hover:bg-accent/10 hover:text-accent',
  danger: 'border-danger/60 bg-danger/10 text-danger hover:bg-danger/15',
};

export const BUTTON_SIZE_CLASS_MAP: Record<ButtonSize, string> = {
  md: 'h-11 px-6 text-[0.8rem] tracking-[0.18em] md:text-sm',
  sm: 'h-9 px-4 text-[0.7rem] tracking-[0.18em] md:text-xs',
};

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export const getButtonClassName = ({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonClassOptions = {}): string =>
  cn(BUTTON_BASE_CLASSES, BUTTON_VARIANT_CLASS_MAP[variant], BUTTON_SIZE_CLASS_MAP[size], className);
