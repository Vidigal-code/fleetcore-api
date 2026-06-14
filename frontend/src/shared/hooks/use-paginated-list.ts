'use client';

import { useMemo, useState } from 'react';

export interface PaginatedList<T> {
  /** Itens da página atual (recorte de `source`). */
  items: T[];
  /** Página atual já normalizada para um intervalo válido. */
  page: number;
  /** Quantidade de itens por página. */
  pageSize: number;
  /** Total de itens na origem. */
  total: number;
  /** Total de páginas (mínimo de 1). */
  totalPages: number;
  /** Atualiza a página desejada (o clamp é aplicado automaticamente). */
  setPage: (page: number) => void;
}

/**
 * Hook reutilizável de paginação client-side.
 *
 * Encapsula o estado de página, o clamp para um intervalo válido e o recorte da
 * lista — evitando que cada listagem reimplemente essa lógica.
 */
export const usePaginatedList = <T>(
  source: readonly T[],
  pageSize: number,
): PaginatedList<T> => {
  const [page, setPage] = useState(1);

  const total = source.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  const items = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return source.slice(start, start + pageSize);
  }, [source, safePage, pageSize]);

  return { items, page: safePage, pageSize, total, totalPages, setPage };
};
