'use client';

import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export interface TableColumn<TItem> {
  key: string;
  header: ReactNode;
  render: (item: TItem) => ReactNode;
  width?: string;
}

export interface TableProps<TItem> extends HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<TItem>[];
  data: TItem[];
  emptyState?: ReactNode;
  loading?: boolean;
}

export const DataTable = <TItem,>({
  columns,
  data,
  emptyState,
  loading = false,
  className,
  ...props
}: TableProps<TItem>) => {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border/50 bg-surface/60 shadow-[var(--shadow-elevated)] backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="grid grid-cols-1 gap-3 border-b border-border/40 bg-surface-strong/80 px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] sm:text-left">
            {columns.map((column) => (
              <div key={column.key} style={column.width ? { minWidth: column.width } : undefined}>
                {column.header}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            {loading ? (
              <div className="px-6 py-10 text-center text-sm text-muted">Carregando...</div>
            ) : data.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted">
                {emptyState ?? 'Nenhum registro encontrado.'}
              </div>
            ) : (
              data.map((item, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-1 gap-3 border-b border-border/20 px-6 py-4 text-center text-sm text-foreground last:border-b-0 hover:bg-accent/10 sm:grid-cols-[repeat(auto-fit,minmax(140px,1fr))] sm:text-left"
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      style={column.width ? { minWidth: column.width } : undefined}
                    >
                      {column.render(item)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
