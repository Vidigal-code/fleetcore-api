'use client';

import { useEffect, type RefObject } from 'react';

interface UseDismissOptions {
  enabled: boolean;
  ref: RefObject<HTMLElement | null>;
  onDismiss: () => void;
}

/**
 * Fecha um elemento flutuante (dropdown, popover, menu) quando o usuario clica
 * fora dele ou pressiona Escape. Reutilizavel por qualquer overlay — mantem a
 * logica de dispensa em um unico lugar (DRY/SRP).
 */
export const useDismiss = ({ enabled, ref, onDismiss }: UseDismissOptions): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, ref, onDismiss]);
};
