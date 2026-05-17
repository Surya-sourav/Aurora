import { cn } from '@/lib/cn';

interface Props {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, error, required, children, className }: Props) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-xs font-mono uppercase tracking-wider text-[--color-muted]">
        <span className="text-[--color-faint]">$ </span>
        {label}
        {required && <span className="text-[--color-accent]"> *</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="text-xs text-[--color-faint] font-mono">{hint}</span>
      )}
      {error && <span className="text-xs text-[--color-danger] font-mono">{error}</span>}
    </label>
  );
}
