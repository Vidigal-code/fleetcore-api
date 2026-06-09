'use client';

import type { HTMLAttributes } from 'react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  page,
  total,
  limit,
  onPageChange,
  className,
  ...props
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-full border border-border/50 bg-surface/70 px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted shadow-sm backdrop-blur-xl sm:flex-row sm:justify-between',
        className,
      )}
      {...props}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
      >
        Anterior
      </Button>
      <span>
        Página {page} de {totalPages}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={!canNext}
        onClick={() => canNext && onPageChange(page + 1)}
      >
        Próxima
      </Button>
    </div>
  );
};
