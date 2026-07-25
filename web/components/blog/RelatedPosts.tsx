import Link from 'next/link';
import type { BlogSummary } from '@/lib/types';

interface Props {
  current: { id: string; tags: string[]; category_id: string | null };
  all: BlogSummary[];
  limit?: number;
}

function scorePost(
  current: Props['current'],
  candidate: BlogSummary,
): number {
  if (candidate.id === current.id) return -1;
  let score = 0;
  if (current.category_id && candidate.category_id === current.category_id) {
    score += 3;
  }
  const overlap = candidate.tags.filter((t) => current.tags.includes(t)).length;
  score += overlap * 2;
  return score;
}

export function RelatedPosts({ current, all, limit = 3 }: Props) {
  const related = all
    .filter((b) => b.id !== current.id && b.is_published)
    .map((b) => ({ blog: b, score: scorePost(current, b) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.blog);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-6 border-t border-[--color-border]">
      <h3 className="font-mono text-sm text-[--color-muted] mb-4">
        <span className="text-[--color-faint]">## </span>related
      </h3>
      <ul className="space-y-1">
        {related.map((b) => (
          <li key={b.id}>
            <Link
              href={`/blog/${b.slug}`}
              className="flex items-baseline gap-2 py-1.5 group"
            >
              <span className="text-[--color-faint] text-xs">▸</span>
              <span className="font-mono text-sm text-[--color-fg] group-hover:text-[--color-accent] transition-colors">
                {b.heading}
              </span>
              <span className="font-mono text-xs text-[--color-faint] ml-auto shrink-0">
                {b.reading_time_minutes}m
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
