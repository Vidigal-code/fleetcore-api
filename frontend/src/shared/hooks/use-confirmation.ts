'use client';

import { useCallback, useState } from 'react';

export interface Confirmation<T> {
  /** Alvo aguardando confirmação (ou `null` quando inativo). */
  target: T | null;
  /** Indica se o diálogo de confirmação deve estar aberto. */
  isOpen: boolean;
  /** Solicita confirmação para um alvo. */
  request: (target: T) => void;
  /** Cancela a confirmação pendente. */
  cancel: () => void;
  /** Executa a ação confirmada e limpa o estado. */
  confirm: () => Promise<void>;
}

/**
 * Hook reutilizável para o fluxo "solicitar → confirmar/cancelar" de ações
 * destrutivas (ex.: remoção). Remove a duplicação entre as listagens.
 */
export const useConfirmation = <T>(
  onConfirm: (target: T) => Promise<void> | void,
): Confirmation<T> => {
  const [target, setTarget] = useState<T | null>(null);

  const request = useCallback((next: T) => setTarget(next), []);
  const cancel = useCallback(() => setTarget(null), []);

  const confirm = useCallback(async () => {
    if (target === null) return;
    await onConfirm(target);
    setTarget(null);
  }, [target, onConfirm]);

  return { target, isOpen: target !== null, request, cancel, confirm };
};
