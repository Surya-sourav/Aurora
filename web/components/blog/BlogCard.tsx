import Link from 'next/link';
import type { BlogSummary } from '@/lib/types';
import { TagChip } from './TagChip';
import { ReadingTime } from './ReadingTime';
import { ViewCountBadge } from '@/components/layout/ViewCountBadge';

export function BlogCard({ blog }: { blog: BlogSummary }) {
  const date = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'draft';
  return (
    <article className="group py-6 border-b border-[--color-border] last:border-0">
      <Link
        href={`/blog/${blog.slug}`}
        className="block space-y-2 hover:text-[--color-accent] transition-colors"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-mono text-base font-medium text-[--color-fg] group-hover:text-[--color-accent] transition-colors">
            {blog.heading}
          </h3>
          <time className="font-mono text-xs text-[--color-faint] shrink-0">
            {date}
          </time>
        </div>
        {blog.excerpt && (
          <p className="font-serif text-[--color-muted] leading-relaxed text-sm">
            {blog.excerpt}
          </p>
        )}
      </Link>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {blog.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
        <ReadingTime minutes={blog.reading_time_minutes} />
        <ViewCountBadge count={blog.view_count} />
        {!blog.is_published && (
          <span className="font-mono text-xs text-[--color-danger] border border-[--color-danger] rounded-md px-2 h-6 inline-flex items-center">
            draft
          </span>
        )}
      </div>
    </article>
  );
}
