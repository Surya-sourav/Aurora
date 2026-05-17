import Link from 'next/link';

export function TagChip({ tag, active }: { tag: string; active?: boolean }) {
  return (
    <Link
      href={`/blog?tag=${encodeURIComponent(tag)}`}
      className={`font-mono text-xs px-2 h-6 inline-flex items-center rounded-md border transition-colors ${
        active
          ? 'border-[--color-accent] text-[--color-accent]'
          : 'border-[--color-border] text-[--color-muted] hover:border-[--color-accent] hover:text-[--color-accent]'
      }`}
    >
      <span className="text-[--color-faint]">#</span>
      {tag}
    </Link>
  );
}
