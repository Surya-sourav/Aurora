import { cn } from '@/lib/cn';

export function ProseLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-[680px] px-6 py-12 md:py-16', className)}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-sm text-[--color-muted] mb-4 mt-12 first:mt-0">
      <span className="text-[--color-faint]">## </span>
      {children}
    </h2>
  );
}
