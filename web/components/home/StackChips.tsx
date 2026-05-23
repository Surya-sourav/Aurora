export function StackChips({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {items.map((s) => (
        <span
          key={s}
          className="font-mono text-xs px-2 h-6 inline-flex items-center rounded-md text-[--color-muted] bg-[--color-bg-elev] border border-[--color-border] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
        >
          <span className="text-[--color-faint] mr-0.5">·</span>
          {s}
        </span>
      ))}
    </div>
  );
}
