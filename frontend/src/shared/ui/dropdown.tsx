'use client';

import { type ReactNode, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { useDismiss } from '@/shared/hooks/use-dismiss';
import { cn } from '@/shared/lib/utils';

export type DropdownAlign = 'start' | 'center' | 'end';
export type DropdownTone = 'default' | 'danger';

export interface DropdownItem {
  id: string;
  label: string;
  active?: boolean;
  tone?: DropdownTone;
  icon?: ReactNode;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  active?: boolean;
  align?: DropdownAlign;
  className?: string;
  triggerClassName?: string;
  ariaLabel?: string;
}

const TRIGGER_BASE_CLASSES =
  'inline-flex h-10 w-full items-center justify-between gap-2 rounded-full border border-border/60 bg-surface/80 px-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm backdrop-blur transition-colors duration-base ease-subtle hover:border-accent/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background';

const TRIGGER_ACTIVE_CLASSES = 'border-accent/70 text-accent';

const PANEL_BASE_CLASSES =
  'absolute top-[calc(100%+0.5rem)] z-50 min-w-[12rem] overflow-hidden rounded-2xl border border-border/60 bg-surface/95 p-1.5 shadow-elevated backdrop-blur-xl';

const PANEL_ALIGN_CLASS_MAP: Record<DropdownAlign, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

const ITEM_BASE_CLASSES =
  'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-base ease-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50';

const ITEM_TONE_CLASS_MAP: Record<DropdownTone, string> = {
  default: 'text-muted hover:bg-accent/10 hover:text-accent',
  danger: 'text-danger hover:bg-danger/10 hover:text-danger',
};

const ITEM_ACTIVE_CLASSES = 'bg-accent/15 text-accent';

const resolveItemClassName = (item: DropdownItem): string =>
  cn(
    ITEM_BASE_CLASSES,
    ITEM_TONE_CLASS_MAP[item.tone ?? 'default'],
    item.active && ITEM_ACTIVE_CLASSES,
  );

export const Dropdown = ({
  label,
  items,
  onSelect,
  active = false,
  align = 'start',
  className,
  triggerClassName,
  ariaLabel,
}: DropdownProps) => {
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);
  useDismiss({ enabled: isOpen, ref: containerRef, onDismiss: close });

  const handleSelect = (item: DropdownItem) => {
    close();
    onSelect(item);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel ?? label}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(TRIGGER_BASE_CLASSES, (active || isOpen) && TRIGGER_ACTIVE_CLASSES, triggerClassName)}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted transition-transform duration-base', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <div id={menuId} role="menu" aria-label={ariaLabel ?? label} className={cn(PANEL_BASE_CLASSES, PANEL_ALIGN_CLASS_MAP[align])}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(item)}
              className={resolveItemClassName(item)}
            >
              {item.icon ? <span className="flex h-4 w-4 items-center justify-center">{item.icon}</span> : null}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};
