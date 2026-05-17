'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-9 w-full rounded-md border border-[--color-border] bg-[--color-bg-elev] px-3 text-sm',
          'font-mono text-[--color-fg] placeholder:text-[--color-faint]',
          'focus:outline-none focus:border-[--color-accent]',
          'disabled:opacity-50',
          className,
        )}
        {...rest}
      />
    );
  },
);
