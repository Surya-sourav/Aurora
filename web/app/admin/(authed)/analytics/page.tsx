import Link from 'next/link';
import { cookies } from 'next/headers';
import { API_URL } from '@/lib/api';
import type { AnalyticsSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function fetchAnalytics(): Promise<AnalyticsSummary | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('aurora_token')?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${API_URL}/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as AnalyticsSummary & { success: boolean };
    return data;
  } catch {
    return null;
  }
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="border border-[--color-border] rounded-md p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[--color-faint]">
        {label}
      </div>
      <div
        className={`font-mono text-2xl mt-1 ${
          accent ? 'text-[--color-accent]' : 'text-[--color-fg]'
        }`}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const data = await fetchAnalytics();
  if (!data) {
    return (
      <div className="font-mono text-sm text-[--color-danger]">
        analytics unavailable
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <h2 className="font-mono text-lg">
        <span className="text-[--color-faint]">## </span>analytics
      </h2>

      <section>
        <h3 className="font-mono text-sm text-[--color-muted] mb-3">
          <span className="text-[--color-faint]">$ </span>views
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Stat label="portfolio views" value={data.portfolio_views} accent />
          <Stat label="blog views (total)" value={data.total_blog_views} accent />
          <Stat label="note views (total)" value={data.total_note_views} accent />
        </div>
      </section>

      <section>
        <h3 className="font-mono text-sm text-[--color-muted] mb-3">
          <span className="text-[--color-faint]">$ </span>content
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="published blogs" value={data.published_blogs} />
          <Stat label="drafts" value={data.draft_blogs} />
          <Stat label="total blogs" value={data.total_blogs} />
          <Stat label="notes" value={data.total_notes} />
        </div>
      </section>

      <section>
        <h3 className="font-mono text-sm text-[--color-muted] mb-3">
          <span className="text-[--color-faint]">$ </span>top posts
        </h3>
        {data.top_posts.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint]">no posts yet</p>
        ) : (
          <ol className="border border-[--color-border] rounded-md divide-y divide-[--color-border]">
            {data.top_posts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 p-3">
                <span className="font-mono text-xs text-[--color-faint] w-6">
                  {String(i + 1).padStart(2, '0')}.
                </span>
                <Link
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-[--color-fg] hover:text-[--color-accent] flex-1 min-w-0 truncate"
                >
                  {p.heading}
                </Link>
                <span className="font-mono text-xs text-[--color-accent] shrink-0">
                  {p.view_count.toLocaleString()} views
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <h3 className="font-mono text-sm text-[--color-muted] mb-3">
          <span className="text-[--color-faint]">$ </span>recent drafts
        </h3>
        {data.recent_drafts.length === 0 ? (
          <p className="font-mono text-sm text-[--color-faint]">no drafts</p>
        ) : (
          <ul className="border border-[--color-border] rounded-md divide-y divide-[--color-border]">
            {data.recent_drafts.map((d) => (
              <li key={d.id} className="flex items-center gap-3 p-3">
                <Link
                  href={`/admin/blog/${d.slug}/edit`}
                  className="font-mono text-sm text-[--color-fg] hover:text-[--color-accent] flex-1 min-w-0 truncate"
                >
                  {d.heading}
                </Link>
                <span className="font-mono text-xs text-[--color-faint] shrink-0">
                  {new Date(d.updated_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
