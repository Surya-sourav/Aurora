import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import type { BlogSummary, Series } from '@/lib/types';

interface Props {
  series: Series;
  siblings: BlogSummary[];
  currentSlug: string;
}

export function SeriesNav({ series, siblings, currentSlug }: Props) {
  const sorted = [...siblings]
    .filter((b) => b.is_published)
    .sort(
      (a, b) =>
        a.series_order - b.series_order ||
        (a.published_at ?? '').localeCompare(b.published_at ?? ''),
    );
  const idx = sorted.findIndex((b) => b.slug === currentSlug);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;

  return (
    <section className="my-8 border border-[--color-border] rounded-md overflow-hidden">
      <div className="flex items-center gap-2 px-4 h-9 border-b border-[--color-border] bg-[--color-bg-elev] font-mono text-xs">
        <BookOpen size={12} className="text-[--color-accent]" />
        <span className="text-[--color-muted]">series:</span>
        <Link
          href={`/series/${series.slug}`}
          className="text-[--color-fg] hover:text-[--color-accent]"
        >
          {series.name}
        </Link>
        <span className="text-[--color-faint] ml-auto">
          part {idx + 1} of {sorted.length}
        </span>
      </div>
      <ul className="divide-y divide-[--color-border]/60">
        {sorted.map((b, i) => (
          <li key={b.id}>
            <Link
              href={`/blog/${b.slug}`}
              className={`flex items-center gap-3 px-4 py-2 group ${
                b.slug === currentSlug ? 'bg-[--color-bg-elev]' : ''
              }`}
            >
              <span className="font-mono text-xs text-[--color-faint] w-6 shrink-0">
                {String(i + 1).padStart(2, '0')}.
              </span>
              <span
                className={`font-mono text-sm flex-1 min-w-0 truncate ${
                  b.slug === currentSlug
                    ? 'text-[--color-accent]'
                    : 'text-[--color-fg] group-hover:text-[--color-accent]'
                } transition-colors`}
              >
                {b.heading}
              </span>
              {b.slug === currentSlug && (
                <span className="text-[10px] font-mono text-[--color-accent]">
                  ← you are here
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {(prev || next) && (
        <div className="grid grid-cols-2 border-t border-[--color-border]">
          <div className="p-3 border-r border-[--color-border]">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex items-center gap-2 group"
              >
                <ArrowLeft size={12} className="text-[--color-faint]" />
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[--color-faint]">
                    prev
                  </div>
                  <div className="font-mono text-xs text-[--color-fg] group-hover:text-[--color-accent] truncate">
                    {prev.heading}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="font-mono text-xs text-[--color-faint]">
                (start of series)
              </div>
            )}
          </div>
          <div className="p-3 text-right">
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="flex items-center gap-2 justify-end group"
              >
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[--color-faint]">
                    next
                  </div>
                  <div className="font-mono text-xs text-[--color-fg] group-hover:text-[--color-accent] truncate">
                    {next.heading}
                  </div>
                </div>
                <ArrowRight size={12} className="text-[--color-faint]" />
              </Link>
            ) : (
              <div className="font-mono text-xs text-[--color-faint]">
                (end of series)
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
