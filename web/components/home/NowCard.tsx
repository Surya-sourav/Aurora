import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer';

export function NowCard({ children }: { children: string }) {
  if (!children?.trim()) return null;
  return (
    <section className="my-8 border border-[--color-border] rounded-md overflow-hidden">
      <div className="flex items-center gap-2 px-3 h-8 border-b border-[--color-border] bg-[--color-bg-elev] font-mono text-xs text-[--color-muted]">
        <span className="text-[--color-accent]">$</span>
        <span>now</span>
        <span className="text-[--color-faint]">—</span>
        <span className="text-[--color-faint]">what i'm working on</span>
      </div>
      <div className="px-5 py-4">
        <MarkdownRenderer>{children}</MarkdownRenderer>
      </div>
    </section>
  );
}
