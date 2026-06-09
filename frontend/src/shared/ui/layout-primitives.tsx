"use client";

import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '@/shared/lib/utils';

type SectionElement = 'div' | 'section' | 'article';
type SectionWidth = 'md' | 'lg' | 'xl' | 'full';
type SectionLayout = 'stack' | 'grid';
type SectionSplit = 'even' | 'wide-left' | 'wide-right';
type SectionAlign = 'start' | 'center';

export interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const sectionWidthMap: Record<SectionWidth, string> = {
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  full: 'max-w-none',
};

const layoutBaseMap: Record<SectionLayout, string> = {
  stack: 'flex flex-col gap-6 sm:gap-8',
  grid: 'grid gap-6 sm:gap-8',
};

const layoutSplitMap: Record<SectionSplit, string> = {
  even: 'lg:grid-cols-[repeat(2,minmax(0,1fr))]',
  'wide-left': 'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]',
  'wide-right': 'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]',
};

const alignMap: Record<SectionAlign, string> = {
  start: '',
  center: 'items-center text-center sm:items-start sm:text-left',
};

const baseContainerClasses =
  'mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:gap-12 lg:px-8 xl:px-12';

export const PageContainer = ({
  as: Component = 'div',
  className,
  ...props
}: PageContainerProps) => (
  <Component className={cn(baseContainerClasses, className)} {...props} />
);

export interface PageSectionProps extends HTMLAttributes<HTMLElement> {
  as?: SectionElement;
  width?: SectionWidth;
  layout?: SectionLayout;
  split?: SectionSplit;
  align?: SectionAlign;
}

export const PageSection = ({
  as: Component = 'section',
  width = 'lg',
  layout = 'stack',
  split = 'wide-left',
  align = 'start',
  className,
  ...props
}: PageSectionProps) => {
  const layoutClasses = layout === 'grid'
    ? cn(layoutBaseMap.grid, layoutSplitMap[split])
    : layoutBaseMap.stack;

  return (
    <Component
      className={cn(
        'mx-auto w-full',
        sectionWidthMap[width],
        layoutClasses,
        alignMap[align],
        className,
      )}
      {...props}
    />
  );
};

type SurfaceTone = 'base' | 'strong' | 'contrast';
type SurfaceElevation = 'none' | 'low' | 'elevated' | 'floating';
type SurfacePadding = 'none' | 'sm' | 'md' | 'lg';
type SurfaceRadius = 'lg' | 'xl';
type SurfaceGlass = 'none' | 'base' | 'strong';

const toneClassMap: Record<SurfaceTone, string> = {
  base: 'bg-surface/80 border border-border/60',
  strong: 'bg-surface-strong/85 border border-border/50',
  contrast: 'bg-background/78 border border-border/50',
};

const elevationClassMap: Record<SurfaceElevation, string> = {
  none: 'shadow-none',
  low: 'shadow-sm shadow-border/30',
  elevated: 'shadow-[var(--shadow-elevated)]',
  floating: 'shadow-[var(--shadow-floating)]',
};

const paddingClassMap: Record<SurfacePadding, string> = {
  none: 'p-0',
  sm: 'px-4 py-4 sm:px-5 sm:py-5',
  md: 'px-6 py-6 sm:px-7 sm:py-7',
  lg: 'px-8 py-8 sm:px-9 sm:py-9',
};

const radiusClassMap: Record<SurfaceRadius, string> = {
  lg: 'rounded-3xl',
  xl: 'rounded-[2.5rem]',
};

const glassClassMap: Record<SurfaceGlass, string> = {
  none: '',
  base: 'backdrop-blur-[var(--blur-glass-md)]',
  strong: 'backdrop-blur-[var(--blur-glass-lg)]',
};

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  tone?: SurfaceTone;
  elevation?: SurfaceElevation;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
  glass?: SurfaceGlass;
  align?: SectionAlign;
  width?: SectionWidth;
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  {
    tone = 'base',
    elevation = 'elevated',
    padding = 'md',
    radius = 'lg',
    glass = 'base',
    align = 'start',
    width = 'full',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto w-full',
        width === 'full' ? '' : sectionWidthMap[width],
        toneClassMap[tone],
        elevationClassMap[elevation],
        paddingClassMap[padding],
        radiusClassMap[radius],
        glassClassMap[glass],
        align === 'center' ? 'text-center lg:text-left' : 'text-left',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

type StackGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const stackGapMap: Record<StackGap, string> = {
  xs: 'gap-2',
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: StackGap;
  distribute?: 'start' | 'center' | 'between';
}

export const Stack = ({
  gap = 'md',
  distribute = 'start',
  className,
  ...props
}: StackProps) => (
  <div
    className={cn(
      'flex flex-col',
      stackGapMap[gap],
      distribute === 'center'
        ? 'items-center text-center'
        : distribute === 'between'
          ? 'justify-between'
          : 'items-start text-left',
      className,
    )}
    {...props}
  />
);

type GridJustify = 'start' | 'center';

export interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: SectionSplit;
  justify?: GridJustify;
}

export const ResponsiveGrid = ({
  columns = 'wide-left',
  justify = 'start',
  className,
  ...props
}: ResponsiveGridProps) => (
  <div
    className={cn(
      'grid w-full gap-6 lg:gap-8',
      layoutSplitMap[columns],
      justify === 'center' ? 'items-center text-center lg:text-left' : 'items-start text-left',
      className,
    )}
    {...props}
  />
);

type WithDividerOptions = {
  divider?: boolean;
  dividerClassName?: string;
};

export interface SurfaceSectionProps
  extends ComponentPropsWithoutRef<typeof Surface>,
    WithDividerOptions {}

export const SurfaceSection = ({
  divider = false,
  dividerClassName,
  children,
  className,
  ...props
}: SurfaceSectionProps) => (
  <Surface className={cn('space-y-6', className)} {...props}>
    {divider ? (
      <div className="space-y-6">
        {children}
        <div className={cn('h-px w-full bg-border/40', dividerClassName)} />
      </div>
    ) : (
      children
    )}
  </Surface>
);
