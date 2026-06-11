'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
}

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
};

/**
 * Modal global e responsivo. Renderiza em portal (document.body) com posicao
 * fixa, escapando de qualquer stacking context. Em telas pequenas ocupa a
 * largura toda (bottom sheet, conteudo empilhado); em telas maiores vira um
 * dialog centralizado. Fecha no Escape, no backdrop e trava o scroll do body.
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[1000] flex items-end justify-center overflow-y-auto bg-background/70 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          'relative flex w-full max-h-[100dvh] flex-col gap-5 overflow-y-auto border border-border/60 bg-surface/95 p-6 shadow-elevated backdrop-blur-xl',
          'rounded-t-3xl sm:max-h-[90vh] sm:rounded-3xl',
          SIZE_CLASS[size],
        )}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted transition-colors duration-base hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <X className="h-4 w-4" />
        </button>

        {title || description ? (
          <div className="flex flex-col gap-1 pr-14 text-center sm:text-left">
            {title ? (
              <h2 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h2>
            ) : null}
            {description ? <p className="text-sm text-muted">{description}</p> : null}
          </div>
        ) : null}

        <div className="flex flex-col gap-4">{children}</div>

        {footer ? (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
