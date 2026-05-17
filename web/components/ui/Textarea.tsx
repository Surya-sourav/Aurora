'use client';
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-md border border-[--color-border] bg-[--color-bg-elev] px-3 py-2 text-sm',
        'font-mono text-[--color-fg] placeholder:text-[--color-faint]',
        'focus:outline-none focus:border-[--color-accent]',
        'resize-vertical min-h-[160px]',
        className,
      )}
      {...rest}
    />
  );
});
