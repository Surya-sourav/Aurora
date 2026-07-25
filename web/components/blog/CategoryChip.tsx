import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  category: Pick<Category, 'name' | 'slug' | 'color'>;
  active?: boolean;
  as?: 'link' | 'badge';
  size?: 'sm' | 'md';
}

export function CategoryChip({ category, active, as = 'link', size = 'sm' }: Props) {
  const color = category.color?.trim() || undefined;
  const style = color ? { borderColor: color, color } : undefined;
  const cls = `inline-flex items-center gap-1 font-mono ${
    size === 'md' ? 'text-sm h-7 px-2.5' : 'text-xs h-6 px-2'
  } rounded-md border ${
    active
      ? 'border-[--color-accent] text-[--color-accent]'
      : color
        ? 'hover:opacity-80 transition-opacity'
        : 'border-[--color-border] text-[--color-muted] hover:border-[--color-accent] hover:text-[--color-accent] transition-colors'
  }`;
  const content = (
    <>
      <span className="text-[--color-faint]">▸</span>
      {category.name}
    </>
  );
  if (as === 'badge') {
    return (
      <span className={cls} style={style}>
        {content}
      </span>
    );
  }
  return (
    <Link
      href={`/blog?category=${encodeURIComponent(category.slug)}`}
      className={cls}
      style={style}
    >
      {content}
    </Link>
  );
}
