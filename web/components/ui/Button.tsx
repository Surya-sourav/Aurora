'use client';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = 'outline', size = 'md', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-4 text-sm',
        variant === 'primary' &&
          'bg-[--color-accent] text-[--color-accent-fg] hover:opacity-90',
        variant === 'outline' &&
          'border border-[--color-border] text-[--color-fg] hover:border-[--color-accent] hover:text-[--color-accent]',
        variant === 'ghost' &&
          'text-[--color-muted] hover:text-[--color-fg] hover:bg-[--color-bg-elev]',
        variant === 'danger' &&
          'border border-[--color-border] text-[--color-danger] hover:bg-[color-mix(in_oklch,var(--color-danger)_15%,transparent)]',
        className,
      )}
      {...rest}
    />
  );
});
