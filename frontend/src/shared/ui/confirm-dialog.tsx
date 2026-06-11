'use client';

import { type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: 'danger' | 'primary';
}

/**
 * Dialogo de confirmacao padronizado (substitui window.confirm). Reutiliza o
 * Modal global, entao herda o comportamento responsivo. Usado para acoes
 * destrutivas (excluir) em todo o CRUD.
 */
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  tone = 'danger',
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    onClose={onClose}
    size="sm"
    closeOnBackdrop={!loading}
    footer={
      <>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={tone === 'danger' ? 'danger' : 'primary'}
          size="sm"
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      <span
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
          tone === 'danger' ? 'bg-danger/15 text-danger' : 'bg-accent/15 text-accent',
        )}
      >
        <AlertTriangle className="h-6 w-6" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description ? <p className="text-sm text-muted">{description}</p> : null}
      </div>
    </div>
  </Modal>
);
